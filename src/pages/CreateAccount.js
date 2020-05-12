import React from "react";
// Components
import CreateAccountFrom from "../components/CreateAccountForm";

function CreateAccount({ CreateAccountFunction }) {
    return (
        <div>
            <h1>Create Account</h1>
            <CreateAccountFrom CreateAccountFunction={CreateAccountFunction} />
        </div>
    );
}

export default CreateAccount;