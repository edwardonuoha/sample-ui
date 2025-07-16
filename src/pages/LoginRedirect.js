import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";

function LoginRedirect() {
    const { loginWithRedirect } = useAuth0();
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const referralCode = searchParams.get('referral');

        // Automatically redirect to Auth0 on component mount
        loginWithRedirect({
            authorizationParams: {
                redirect_uri: window.location.origin,  // Use the allowed callback URL
                ...(referralCode && { referral: referralCode })
            }
        });
    }, [loginWithRedirect, location.search]); // Dependencies for useEffect

    return null; // This component doesn't render anything
}

export default LoginRedirect; 