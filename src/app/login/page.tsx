"use client";

import CenterModal from "@/components/common/modals/CenterModal";

export default function Login() {
    return (
        <CenterModal
            isOpen={true}
            onClose={() => {}}
            title="Login"
            topContent={<p className="text-sm">Hello this is a test</p>}
            primaryActionProps={{
                title: "Login",
            }}
            secondaryActionProps={{
                title: "Sign Up",
            }}
        >
            <div>Hello</div>
        </CenterModal>
    );
}
