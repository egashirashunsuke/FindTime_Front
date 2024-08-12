import React from "react";
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import LogoutIcon from '@mui/icons-material/Logout';
import CommentIcon from '@mui/icons-material/Comment';

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
    },{
        title: "ログアウト",
        icon: <LogoutIcon />,
        link: "/logout",
    },{
        title: "意見箱",
        icon: <CommentIcon />,
        link: "/question",
    }
]

