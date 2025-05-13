import express from "express"
import * as signupControllers from "../controllers/signupControllers.js";
import * as parkingControllers from "../controllers/parkingControllers.js";
import * as otherAdminControllers from "../controllers/otherAdminControllers.js";
import * as authControllers from "../controllers/authControllers.js"
import * as refreshTokenControllers from "../controllers/refreshTokenController.js"
import * as logoutControllers from "../controllers/logoutControllers.js"
import * as profileControllers from "../controllers/profileControllers.js"
import { verifyJWT } from "../middleware/verifyJWT.js";
import { verifyAccountType } from "../middleware/verifyAccountType.js";



let router = express.Router();

let initWebRoutes = (app) => {
    

    // Signup
    router.post("/signup", signupControllers.signupPost);

    // Login Authentication
    router.post("/login", authControllers.handleLogin)

    // Refresh Tokken key
    router.post("/refresh", refreshTokenControllers.handleRefreshToken)

    // Logout
    router.delete('/logout', logoutControllers.handleLogout)

    // Parking User \\
    
    // Will get the list of parking zone and the number of available and occupied spot
    router.get("/parkingZones", verifyJWT, verifyAccountType("Student", "Worker"), parkingControllers.parkingZones)

    // Will get all of the lot data in a parking zone
    router.get("/parkingZone/:zone",  verifyJWT, verifyAccountType("Student", "Worker"),  parkingControllers.parkingZone)

    // Profile User \\
    router.get("/profile/:ID", verifyJWT, verifyAccountType("Student", "Worker"), profileControllers.userProfileData )
    router.put("/profile-personal-update", verifyJWT, verifyAccountType("Student", "Worker"), profileControllers.updateProfileDataPersonal)
    router.put("/profile-security-update", verifyJWT, verifyAccountType("Student", "Worker"), profileControllers.updateProfileDataSecurity)
    router.get("/profile-history/:ID", verifyJWT, verifyAccountType("Student", "Worker"), profileControllers.userHistoryProfileData) 

    // Profile Admin \\
    router.get("/admin-profile/:ID", verifyJWT, verifyAccountType("Admin"), profileControllers.userAdminProfileData )
    router.put("/admin-profile-personal-update", verifyJWT, verifyAccountType("Admin"),  profileControllers.updateAdminDataPersonal)
    router.put("/admin-profile-security-update",verifyJWT, verifyAccountType("Admin"),  profileControllers.updateAdminDataSecurity)


    // Parking Admin \\

    // Will get all of the lot data in a parking zone (admin)
    router.get("/parkingOverviewAdmin/:selectedZone", verifyJWT, verifyAccountType("Admin"), parkingControllers.parkingOverviewAdmin)

    // Will POST the vehicle data to the parking zone
    router.post("/adminViewZone/parkVehicle", verifyJWT, verifyAccountType("Admin"), parkingControllers.parkVehicle)

    // Will UPDATE the vehicle data from the parking zone
    router.put("/adminViewZone/vacatingParkingSpace", verifyJWT, verifyAccountType("Admin"), parkingControllers.vacatingParkingSpace)


    // Account Admin \\
    router.get("/accountRecord", verifyJWT, verifyAccountType("Admin"), otherAdminControllers.accountRecord)

    // Account History \\
    router.get("/adminHistory", verifyJWT, verifyAccountType("Admin"), otherAdminControllers.adminParkingHistory)



    return app.use("/", router);
}

export default initWebRoutes;