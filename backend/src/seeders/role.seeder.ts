import mongoose from "mongoose";
import connectDatabse from "../config/database.config";
import RoleModel from "../models/roles-permission.model";
import { RolePermissions } from "../utils/role-permission";


const seedRoles = async () => {
    console.log("Seeding roles started...");

    try {
        await connectDatabse();
        const session = await mongoose.startSession();
        session.startTransaction();

        console.log("Clearing existing roles...");
        await RoleModel.deleteMany({}).session(session);

        for (const roleName in RolePermissions) {
            const role = roleName as keyof typeof RolePermissions;
            const permissions = RolePermissions[role];

            // check if the role already exists
            const existingRole = await RoleModel.findOne({ name: role }).session(session);
            if (!existingRole) {
                console.log("Creating new role...");
                const newRole = new RoleModel({
                    name: role,
                    permissions: permissions,
                });
                await newRole.save({ session });
                console.log(`Role '${role}' created with permissions:`, permissions);
            }else {
                console.log(`Role '${role}' already exists. Skipping creation.`);
            }
        };
        await session.commitTransaction();
        console.log("Session Committed.");
        session.endSession();
        console.log("Session Ended. Seeding roles completed.");

    } catch (error) {
        console.error("Error seeding roles:", error);
    }

}

seedRoles().catch((error) => {
    console.error("Error running seed script:", error);
});