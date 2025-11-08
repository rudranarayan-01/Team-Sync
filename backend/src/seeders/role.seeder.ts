import mongoose from "mongoose";
import connectDatabse from "../config/database.config";
import RoleModel from "../models/roles-permission.model";
import { RolePermissions } from "../utils/role-permission";


const seedRoles = async () => {
    console.log("Seeding roles started...");

    try{
        await connectDatabse();
        const session = await mongoose.startSession();
        session.startTransaction();

        console.log("Clearing existing roles...");
        await RoleModel.deleteMany({}).session(session);

        for (const roleName in RolePermissions){
            const role = roleName as keyof typeof RolePermissions;
            const permissions = RolePermissions[role];
        }
        

    }catch (error) {
        console.error("Error seeding roles:", error);
    }
    
}