import React from 'react'
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

const NavProfile = async () => {
    // THIS WILL RETURN US THE CURRENT USER WHICH IS AUTENTICATED.
    let user = await currentUser();
    // console.log(user);
    return (
        <div className="px-4 flex items-center gap-2 sm:absolute bottom-0 p-10 lg:absolute">
            {/* After SignOut we will redirect to ' redirectUrl '  */}
            <UserButton redirectUrl="/"></UserButton>
            <h1>{user.emailAddresses[0].emailAddress}<span><p>{user.username}</p></span></h1>
        </div>
    )
}

export { NavProfile };
 