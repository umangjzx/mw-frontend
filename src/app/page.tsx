import LoginPage from "@/components/auth/Login";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

export default function Page() {
    return (
        <div className="w-screen h-scree bg-background-input mx-auto p-6">
            <LoginPage />
        </div>
    );
}
