import AuthLayout from "../components/AuthLayout";
import RegisterForm from "../components/RegisterForm";
import useDocumentTitle from "../hooks/useDocumentTitle";

function Register() {
    useDocumentTitle("Đăng ký");
    return (
        <AuthLayout>
            <RegisterForm />
        </AuthLayout>
    );
}

export default Register;
