import AuthLayout from "../components/AuthLayout";
import ForgotPassForm from "../components/ForgotPassForm";
import useDocumentTitle from "../hooks/useDocumentTitle";

function Forgot() {
    useDocumentTitle("Quên mật khẩu");
    return (
        <AuthLayout showBackLink wide>
            <ForgotPassForm />
        </AuthLayout>
    );
}

export default Forgot;
