import React from "react";
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

export const SidebarDate = [
    {
        title:"使い方",
        icon: <ContactSupportIcon />,
        link: "/usecase"
    },
    {
        title: "myスケジュール",
        icon: <PersonIcon />,
        link: "/home",
    },
    {
        title: "グループスケジュール",
        icon: <GroupsIcon />,
        link: "/band",
    },
    {
        title: "グループの作成/参加",
        icon: <PersonAddAlt1Icon />,
        link: "/form",
    },
]

