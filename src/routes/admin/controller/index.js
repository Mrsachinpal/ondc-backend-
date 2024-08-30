import User from "../../../model/user/index.js";
import jwt, { decode } from "jsonwebtoken"
import { Op } from 'sequelize';
import nodemailer from 'nodemailer';
import bcrypt from "bcrypt"
import { config } from "../../../config/index.js";
const { secret_key, ethereal_email, ethereal_password } = config;

import { bankInfo, OrgDetails, userDetails, staffDetails, tokenBlocker } from "../../../model/admin/index.js"
import { v4 as uuidv4 } from "uuid";



class UserAdminController {
    async register(req, res) {
        try {
            const { email_id, first_name, last_name, password, role } = req.body
            const hashedPassword = await bcrypt.hash(password, 10)
            const data = {
                email_id: email_id,
                first_name: first_name,
                last_name: last_name,
                password: hashedPassword,
                role: role
            }
            const isExist = await User.findOne({ where: { email_id: email_id }, raw: true });

            if (!isExist) {
                await User.create(data);
                const token = jwt.sign({ first_name, last_name, email_id, role }, secret_key, { expiresIn: '1h' });

                res.status(200).json({
                    success: true,
                    message: "User Registered Succsessfully",
                    token: token
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "email already exist, Try with new email",
                });
            }
        } catch (error) {
            res.status(400).json({
                error: error
            })
        }
    }

    async login(req, res) {
        try {
            const { email_id, password } = req.body
            const user = await User.findOne(
                {
                    where: { email_id: email_id },
                    raw: true
                },
            );

            if (!user) {
                return res.status(401).json({ message: 'Invalid username', success: false });
            }

            const { first_name, last_name, role, } = user

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ message: 'Invalid password', success: false });
            }

            const token = jwt.sign({ first_name, last_name, email_id, role }, secret_key, { expiresIn: '8h' });
            res.status(200).json({
                success: true,
                message: "User logged in successfully",
                token: token
            })
        } catch (error) {
            res.status(400).json({
                error: error
            })
        }
    }

    async adminRegister(req, res) {
        try {
            console.log("register api hit ")
            const { detailsOfProvider, KYCdetails, KYCurl, bankDetails } = req.body;
            const { email, mobileNumber, Orgname, password, role, accessStatus, isApprovedByAdmin } = detailsOfProvider;
            const { accountHolderName, accountNo, bankName, branchName, ifscCode, cancelledChequeURL } = bankDetails
            const { providerName, registeredAdd, storeEmail, mobileNo, PANNo, GSTIN, FSSAINo } = KYCdetails;
            const { address, idProof, pan, gst } = KYCurl;  // gtting all details 

            const hashedPassword = await bcrypt.hash(password, 10);

            const emailExist = await userDetails.findOne({ where: { email: email } });
            if (emailExist) {
                return res.status(422).json({ message: 'Email already exists', success: false });
            };

            const providerNameExist = await OrgDetails.findOne({ where: { providerName: providerName } });
            if (providerNameExist) {
                return res.status(422).json({ message: 'Provider name already exists', success: false });
            }

            const storeEmailExist = await OrgDetails.findOne({ where: { storeEmail: storeEmail } });
            if (storeEmailExist) {
                return res.status(422).json({ message: 'Store Email already exists', success: false });
            }

            const mobileNoExist = await OrgDetails.findOne({ where: { mobileNo: mobileNo } });
            if (mobileNoExist) {
                return res.status(422).json({ message: 'Mobile Number already exists', success: false });
            }

            const panNoExist = await OrgDetails.findOne({ where: { PANNo: PANNo } });
            if (panNoExist) {
                return res.status(422).json({ message: 'Pan Number already exists', success: false });
            }

            const GSTINExist = await OrgDetails.findOne({ where: { GSTIN: GSTIN } });
            if (GSTINExist) {
                return res.status(422).json({ message: 'GSTIN already exists', success: false });
            }
            const FSSAIExist = await OrgDetails.findOne({ where: { FSSAINo: FSSAINo } });
            if (FSSAIExist) {
                return res.status(422).json({ message: 'FSSAINo already exists', success: false });
            }
            // console.log("FSSAI no. ",FSSAINo)

            const UserDetails = {
                providerId: uuidv4(),
                email: email,
                mobileNumber: mobileNumber,
                Orgname: Orgname,
                password: hashedPassword,
                role: role,
                accessStatus: accessStatus,
                isApprovedByAdmin: isApprovedByAdmin
            }

            const sellerId = UserDetails?.providerId

            const BankDetails = {
                providerId: sellerId,
                accHolderName: accountHolderName,
                accNo: accountNo,
                bankName: bankName,
                branchName: branchName,
                ifscCode: ifscCode,
                cancelledChequeUrl: cancelledChequeURL
            }

            const OrganizationDetails = {
                providerId: sellerId,
                providerName: providerName,
                registeredAdd: registeredAdd,
                storeEmail: storeEmail,
                mobileNo: mobileNo,
                PANNo: PANNo,
                GSTIN: GSTIN,
                FSSAINo: FSSAINo,
                addressURL: address,
                idProofURL: idProof,
                panURL: pan,
                gstURL: gst, // got all above info 

            }

            await userDetails.create(UserDetails);
            await bankInfo.create(BankDetails);
            await OrgDetails.create(OrganizationDetails);

            const token = jwt.sign({ email, sellerId }, secret_key, { expiresIn: '1h' });
            res.status(200).json({
                message: "Seller added successfully",
                token: token,
                success: true
            });
        } catch (error) {

            console.log(error)
            res.status(400).json({
                error: error
            });
        }
    }

    async adminStoreDetail(req, res) {
        try {

            const { authorization } = req.headers;
            if (!authorization) {
                return res.status(401).json({ message: 'Authorization header is missing' });
            }
            const adminRegisterToken = authorization;
            const decodedToken = jwt.verify(adminRegisterToken, secret_key);
            const { sellerId, providerId } = decodedToken;
            console.log("decoded token", decodedToken);

            // Use providerId if it exists, otherwise use sellerId
            const UniqueKey = providerId || sellerId;

            if (!UniqueKey) {
                return res.status(400).json({ message: 'Unique Id is missing from the token' });
            }

            const { storeDetails } = req.body;
            const { category, logoURL, location, locationAvailabilityPANIndia, defaultCancellable, defaultReturnable, fulfillments,
                supportDetails, radius, logisticsBppId, logisticsDeliveryType, Address, storeTimings } = storeDetails;
            const { building, city, state, country, code, locality } = Address;
            const { status, holidays, enabled } = storeTimings;

            const fulfillmentsData = fulfillments.map(fd => ({
                id: uuidv4(),
                type: fd?.type,
                contact: {
                    email: fd?.contact?.email,
                    phone: fd?.contact?.phone
                }
            }));

            // Search for the user based on providerId or sellerId
            const isExist = await userDetails.findOne({
                where: { providerId: UniqueKey },
                raw: true
            });

            if (!isExist) {
                return res.status(404).json({ message: "ProviderId or SellerId does not exist" });
            }

            const OrganizationDetails = {
                category,
                logoURL,
                location,
                locationAvailabilityPANIndia,
                defaultCancellable,
                defaultReturnable,
                fulfillments: fulfillmentsData,
                building,
                city,
                state,
                country,
                code,
                locality,
                supportDetails,
                storeTimingsStatus: status,
                storeTimingHolidays: holidays,
                storeTimingEnabled: enabled,
                radius,
                logisticsBppId,
                logisticsDeliveryType
            };

            // Update the organization details using either providerId or sellerId
            await OrgDetails.update(OrganizationDetails, {
                where: { providerId: UniqueKey }
            });

            const token = jwt.sign({ sellerId }, secret_key, { expiresIn: '1h' });
            res.status(201).json({
                message: "Store details saved successfully",
                success: true
            });

        } catch (error) {
            console.log(error);
            res.status(400).json({ error });
        }
    }

    async adminLogin(req, res) {
        try {
            const { email, password } = req.body;

            const user = await userDetails.findOne({
                where: { email: email },
                raw: true
            });

            const staff = await staffDetails.findOne({
                where: { email: email },
                raw: true
            });

            if (!user && !staff) {
                return res.status(401).json({ message: 'Invalid email' });
            }

            let passwordMatch = false;

            if (user) {
                passwordMatch = await bcrypt.compare(password, user.password);
            } else if (staff) {
                passwordMatch = await bcrypt.compare(password, staff.password);
            }

            if (!passwordMatch) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            let token;
            let message;
            if (user) {
                const { role, providerId, Orgname } = user;
                token = jwt.sign({ role, providerId, Orgname }, secret_key, { expiresIn: '8h' });
                message = "Admin logged in successfully";
            } else if (staff) {
                const { orgId, staffId, name, email, inventory, orders, complaints, accessStatus } = staff;
                token = jwt.sign({ orgId, staffId, name, email, inventory, orders, complaints, accessStatus }, secret_key, { expiresIn: '8h' });
                message = "Staff logged in successfully";
            }

            // Return success response with token
            return res.status(200).json({
                message: message,
                token: token,
                success: true
            });

        } catch (error) {
            return res.status(400).json({ error: 'Server error', details: error.message });
        }
    }

    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const user = await userDetails.findOne(
                {
                    where: { email },
                    raw: true
                },
            );

            const staff = await User.findOne({
                where: { email_id: email },
                raw: true
            });

            if (!user && !staff) {
                return res.status(401).json({ message: 'Email not found' });
            }

            if (user) {
                const token = jwt.sign({ Provider_Id: user.providerId }, secret_key, { expiresIn: '1h' })
                const transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    auth: {
                        user: ethereal_email,
                        pass: ethereal_password
                    }
                });
                console.log("transporter", transporter);
                const mailOptions = {
                    from: ethereal_email,
                    to: user.email,
                    subject: 'Password Reset Request',
                    text: `Click the following link to reset your password: 
                http://localhost:8080/dashboard/forgotPassword/${token}`
                };
                await transporter.sendMail(mailOptions);
                res.json({
                    message: 'Password reset link sent to your email',
                });
            } else if (staff) {
                const token = jwt.sign({ email_id:staff.email_id}, secret_key, { expiresIn: '1h' });
                const transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    auth: {
                        user: ethereal_email,
                        pass: ethereal_password
                    }
                });
                console.log("transporter", transporter);
                const mailOptions = {
                    from: ethereal_email,
                    to: staff.email_id,
                    subject: 'Password Reset Request',
                    text: `Click the following link to reset your password: 
                http://localhost:8080/dashboard/forgotPassword/${token}`
                };
                await transporter.sendMail(mailOptions);
                res.json({
                    message: 'Password reset link sent to your email',
                });

            }

        } catch (error) {
            res.status(400).json({ message: error });
        }

    }

    async forgotPasswordToken(req, res) {
        const { token } = req.params;
        const { newPassword } = req.body;
        console.log("token", token)
        try {
            const decoded = jwt.verify(token, secret_key);
            console.log("decoded", decoded)
            const { Provider_Id, email_id } = decoded;
            console.log("providerId: ", Provider_Id);


            if (Provider_Id) {
                const user = await userDetails.findOne({
                    where: {  providerId:Provider_Id },
                    raw: true
                });
                console.log("user",user)
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                await userDetails.update(
                    { password: hashedPassword },
                    { where: { providerId:Provider_Id } }
                );
                console.log("Password reset for user");

                return res.json({ message: 'Password has been reset successfully' });
            } else if (email_id) {

                const staff = await User.findOne({
                    where: {email_id},
                    raw: true
                });

                if (!staff) {
                    return res.status(404).json({ message: 'Staff not found' });
                }
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                await User.update(
                    { password: hashedPassword },
                    {
                        where: {email_id},
                    }
                );
                console.log("Password reset for staff");

                return res.json({ message: 'Password has been reset successfully' });
            }

            return res.status(400).json({ message: 'Invalid token structure' });

        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
    }

    async addStaff(req, res) {
        try {
            const { orgId, name, email, password, role, inventory, orders, complaints } = req.body;
            const staff = {
                orgId,
                staffId: uuidv4(),
                name,
                email,
                password,
                role,
                inventory,
                orders,
                complaints,
                accessStatus: true
            }
            const staffID = staff.staffId
            const accessStatus = staff.accessStatus
            await staffDetails.create(staff);
            const token = jwt.sign({ orgId, staffID, role, name, email, inventory, orders, complaints, accessStatus }, secret_key, { expiresIn: '1h' });
            res.status(200).json({
                message: "Staff Added Successfully",
                token: token
            });

        } catch (error) {
            res.status(400).json({
                error: error
            });
        }
    }

    async sellerList(req, res) {
        try {
            const sellers = await OrgDetails.findAll({ raw: true });
            res.status(200).json({
                data: sellers
            })
        } catch (error) {
            res.status(400).json({
                error: error
            });
        }
    }

    async staffList(req, res) {
        try {
            const orgId = req.params.id;
            const Staff = await staffDetails.findAll({ where: { orgId: orgId }, raw: true });
            res.status(200).json({
                data: Staff
            });
        } catch (error) {
            res.status(400).json({
                error: error
            })
        }
    }

    async staffaccessControl(req, res) {
        try {
            const { staffId, accessStatus } = req.body;
            const UpdatedStatus = await staffDetails.update({
                accessStatus: accessStatus
            }, {
                where: { staffId: staffId }
            });
            res.status(200).json({
                message: "Status updated successfully",
                status: UpdatedStatus
            })
        } catch (error) {
            res.status(400).json({
                error: error
            })
        }
    }

    async OrgAccControl(req, res) {
        try {
            const { providerId, accessStatus } = req.body;
            const OrgUpdatedStatus = await userDetails.update(
                { accessStatus: accessStatus },
                {
                    where: {
                        providerId: providerId
                    }
                });
            res.status(200).json({
                message: "Organization Status Updated Successfully",
                data: OrgUpdatedStatus
            })
        } catch (error) {
            res.status(400).json({
                error: error
            })
        }
    }

    async sellerUpdate(req, res) {
        try {
            const { providerName, providerId, storeEmail, mobileNo, storeTimingsStatus } = req.body;
            const Status = await OrgDetails.update({
                providerName,
                storeEmail,
                mobileNo,
                storeTimingsStatus,
            },
                {
                    where: { providerId: providerId }
                });
            res.status(200).json({
                message: "Updated Successfully",
                status: Status
            })
        } catch (error) {
            res.status(400).json({
                error: error
            })
        }
    }

    async logout(req, res) {
        try {
            const token = req.headers['authorization'];
            const data = jwt.verify(token, secret_key);
            const { email } = data;
            const blockerData = {
                loginId: email,
                token
            }
            await tokenBlocker.create(blockerData);
            res.status(200).json({
                message: "Logged out successfully",
                success: true
            });
        } catch (error) {
            console.log(error)
            res.status(400).json({
                error: error
            });
        }
    }
}

export default new UserAdminController(); 