import AuthLayout from "../components/AuthLayout";
import LoginForm from "../components/LoginForm";
import useDocumentTitle from "../hooks/useDocumentTitle";

function Login() {
    useDocumentTitle("Đăng nhập");
    return (
        <AuthLayout>
            <LoginForm />
        </AuthLayout>
    );
}

export default Login;
