class CustomMenuService {
    async createMenu(category, data, currentUser) {
        try {
            let menuExist = CustomMenu.findOne({ organization: currentUser.organization, name: data.name });
            if (!menuExist) {
                let menu = new CustomMenu();
                menu.name = data.name,
                    menu.seq = data.seq,
                    menu.longDescription = data.longDescription,
                    menu.shortDescription = data.shortDescription,
                    menu.images = data.images,
                    menu.category = category,
                    menu.organization = currentUser.organization
                await menu.save();
                return menu
            } else {
                res.status(200).json({
                    message: "Menu exist already"
                })
            }
        } catch (error) {
            res.status(400).json({
                error: error
            })
        }
    }

    async updateMenu(menuId, data, currentUser) {
        try {
            let menu = await CustomMenu.findOne({ organization: currentUser.organization, menuId: menuId });
            if (menu) {
                let menuExist = await CustomMenu.findOne({ menuId: { $ne: menuId }, organization: currentUser.organization, name: data.name });
                if (!menuExist) {
                    menu.name = data.name,
                        menu.seq = data.seq,
                        menu.longDescription = data.longDescription,
                        menu.shortDescription = data.shortDescription,
                        menu.images = data.images,
                        await menu.save();
                    const products = data.products;
                    await CustomMenuProduct.deleteMenu({ organization: currentUser.organization, customMenu: menuId });
                    for (const product of products) {
                        let menuProduct = new CustomMenuProduct();
                        menuProduct.organization = currentUser.organization,
                            menuProduct.customMenu = menuId,
                            menuProduct.product = product.id,
                            menuProduct.seq = product.seq
                        await menuProduct.save()
                    }
                    let customMenuTiming = await CustomMenuTiming.findOne({ customMenu: menuId, organization: currentUser.organization });
                    if (customMenuTiming) {
                        customMenuTiming.timings = data.timings
                        await customMenuTiming.save()
                    } else {
                        customMenuTiming = new CustomMenuTiming(),
                            customMenuTiming.customMenu = menuId,
                            customMenuTiming.organization = currentUser.organization,
                            customMenuTiming.timings = data.timings,
                            await customMenuTiming.save()
                    }
                    return menu;
                } else {
                    res.status(200).json({
                        message: "Menu Exists"
                    });
                }
            } else {
                res.status(200).json({
                    message: "Menu doesn't exist"
                });
            }
        } catch (error) {
            res.status(400).json({
                error: error
            });
        }
    }

    async deleteMenu(menuId, currentUser) {
        try {
            let menu = await CustomMenu.findOne({ organization: currentUser.organization, menuId: menuId });
            if (menu) {
                await CustomMenu.deleteOne({ organization: currentUser.organization, menuId: menuId });
                await CustomMenuProduct.deleteMany({ organization: currentUser.organization, customMenu: menuId });
                await CustomMenuTiming.deleteMany({ organization: currentUser.organization, customMenu: menuId });
                return { success: true }
            } else {
                res.status(200).json({
                    message: "Menu doesn't exist"
                });
            }
        } catch (error) {
            res.status(400).json({
                error: error
            });
        }
    }

    async listMenu(params, currentUser) {
        try {
            let query = {
                organization: currentUser.organization
            };
            if (params.name) {
                query.name = { $regex: params.name, $options: 'i' }
            };
            if (params.category) {
                query.category = params.category;
            }
            const menuData = await CustomMenu.find(query).sort({ seq: 'ASC' }).skip(params.offset * params.limit).limit(params.limit);
            const count = await CustomMenu.count(query);
            return {
                count,
                data: menuData
            }
        } catch (error) {
            res.status(400).json({
                error: error
            });
        }
    }

    async getMenu(menuId, currentUser) {
        try {
            let query = {
                organization: currentUser.organization,
                menuId: menuId
            };
            let menu = await CustomMenu.findOne(query).lean();
            let images = [];
            if (menu) {
                if (menu.images && menu.images.length > 0) {
                    for (const image of menu.images) {
                        let data = await s3.getSignedUrlForRead({ path: image });
                        images.push(data);
                    }
                    menu.images = images;
                }
                let menuQuery = {
                    organization: currentUser.organization,
                    customMenu: menuId
                };
                let menuProducts = await CustomMenuProduct.find(menuQuery).sort({ seq: 'ASC' }).populate([{ path: 'product', select: ['menuId', 'productName'] }]);
                let productData = [];
                for (const menuProduct of menuProducts) {
                    let productObj = {
                        id: menuProduct.product.menuId,
                        name: menuProduct.product.productName
                    };
                    productData.push(productObj);
                }
                menu.products = productData;
                let customMenuTiming = await CustomMenuTiming.findOne(menuQuery);
                menu.timings = customMenuTiming?.timings ?? [];
                return menu;
            } else {
                res.status(200).json({
                    message: "Menu doesn't exist"
                });
            }
        } catch (error) {
            res.status(400).json({
                error: error
            })
        }
    }

    async getMenuProducts(menuId, params, currentUser) {
        try {
            let query = {
                organization: currentUser.organization,
                menuId: menuId
            };
            let menu = await CustomMenu.findOne(query);
            if (menu) {
                let menuQuery = {
                    organization: currentUser.organization,
                    customMenu: menuId
                }

                const menuProducts = await CustomMenuProduct.find(menuQuery, { product: 1, menuId: 0 });
                const productList = await Product.find({ organization: currentUser.organization, productCategory: menu.category, menuId: { $nin: menuProducts } }, { productName: 1 });
                return productList
            }
            res.status(200).json({
                message: "Menu doesn't exist"
            })
        } catch (error) {
            res.status(400).json({
                error: error
            })
        }
    }

    async menuOrdering(data, currentUser) {
        try {
            if (data && data.length > 0) {
                for (const menu of data) {
                    await CustomMenu.updateOne({ menuId: menu.menuId, organization: currentUser.organization }, { seq: menu.seq });
                }
            }
            return { success: true }
        } catch (error) {
            res.status(400).json({
                error: error
            })
        }
    }
}

export default new CustomMenuService();