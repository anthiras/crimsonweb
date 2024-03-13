import React from "react";
import { Avatar } from "primereact/avatar";
import { AvatarGroup } from "primereact/avatargroup";

const InstructorsAvatarGroup = ({ instructors, size = 'medium' }) => (
    <AvatarGroup>
        { instructors.map(instructor => <Avatar key={instructor.id} label={initials(instructor.name)} size={size} shape="circle" />) }
        <div className="mx-2">
            { instructors.map(instructor => instructor.name).join(" & ") }
        </div>
    </AvatarGroup>
);

const initials = (name) => name.split(" ").map((n)=>n[0]).slice(-2).join("");

export default InstructorsAvatarGroup;