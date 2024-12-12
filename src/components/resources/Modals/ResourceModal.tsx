import { endpoints } from "@/api/constants";
import { GET_API } from "@/api/request";
import { Input } from "@/components/common/Input";
import CenterModal from "@/components/common/Modals/CenterModal";
import { ResourceFormConstants } from "@/constants/resources";
import { cn } from "@/utils/merge-class";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type ResourceModalProps = {
    isOpen: boolean;
    mode: ShowModalType;
    onClose: () => void;
};

const ResourceModal = ({ isOpen, mode = "view", onClose }: ResourceModalProps) => {
    const [formData, setFormData] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getCategories = async () => {
        const response = await GET_API(endpoints.common.getCategories);
        const categories = response.data.map((item: any) => ({
            label: item.category_name,
            value: item.category_id,
        }));
        return categories;
    };

    const getSkills = async () => {
        const response = await GET_API(endpoints.common.getSkills);
        const skills = response.data.map((item: any) => ({
            label: item.skill_name,
            value: item.skill_name,
            id: item.skill_id,
        }));
        return skills;
    };

    const {
        data: categoriesData,
        isLoading: isCategoriesLoading,
        error: categoriesError,
    } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    const {
        data: skillsData,
        isLoading: isSkillsLoading,
        error: skillsError,
    } = useQuery({
        queryKey: ["skills"],
        queryFn: getSkills,
    });

    const resourceTitle = mode === "edit" ? "Edit Resource" : "Add new Resource";

    const handleSubmit = async () => {
        console.log(formData?.coverImage, "formData skills");

        const payload = {
            resource_title: formData.title,
            resource_description: formData.description,
            resource_skills:
                formData.skills?.map((skill: any) => ({
                    skill_id: "81b8cfbd-1910-4fae-a4fc-14c89987eb07",
                    skill_name: "Music theory",
                })) || [],
            resource_category: {
                category_name: categoriesData?.find((cat: any) => cat.value === formData.category)
                    ?.label,
                category_id: formData.category,
            },
            resource_notes: formData.notes,
            created_by: "learner",
            resource_image: formData.coverImage
                ? {
                      image_url: formData.coverImage.url,
                      image_id: formData.coverImage.id,
                  }
                : null,
        };
        console.log(payload, "payload resource");
        // Uncomment to make the API call
        // POST_API(endpoints.resources.create, payload).then((res) => {
        //     console.log(res, "res");
        //     onClose();
        // }).catch((err) => {
        //     console.log(err, "err");
        // });
    };

    const handleChange = (key: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }));
    };

    const buttonProps = {
        primary: {
            onClick: onClose,
            title: mode === "view" ? "Delete" : "Cancel",
            btnVariant: "secondary" as const,
            customClassName: cn(
                mode === "view"
                    ? "!text-error !bg-error-light !border-none"
                    : "!bg-transparent !text-black",
                "!rounded-xl"
            ),
        },
        secondary: {
            onClick: handleSubmit,
            title: mode === "view" ? "Edit" : "Submit",
            customClassName: "!rounded-xl hover:!bg-black hover:!text-white",
        },
    };

    return (
        <CenterModal
            title={resourceTitle}
            isOpen={isOpen}
            onClose={onClose}
            width="40%"
            customClassName="max-h-[80vh] !rounded-2xl overflow-hidden"
            secondaryActionProps={{
                ...buttonProps.secondary,
                disabled: isSubmitting,
                title: isSubmitting ? "Submitting..." : buttonProps.secondary.title,
            }}
            primaryActionProps={buttonProps.primary}
        >
            {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
            {mode !== "view" ? (
                ResourceFormConstants.map((field: any) => (
                    <Input
                        key={field.name}
                        {...field}
                        inputClassName={field.inputClassName}
                        value={formData[field.name]}
                        onChange={(value: any) => handleChange(field.name, value)}
                        options={
                            field.name === "category"
                                ? categoriesData
                                : field.name === "skills"
                                ? skillsData
                                : field.options
                        }
                    />
                ))
            ) : (
                <div>View</div>
            )}
        </CenterModal>
    );
};

export default ResourceModal;
