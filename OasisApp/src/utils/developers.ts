// src/data/teamData.ts
import { ImageSourcePropType } from 'react-native';

export interface DeveloperCardProps {
    name: string;
    image: ImageSourcePropType | undefined;
    linkedin: string | null;
    github: string | null;
    instagram: string | null;
    behance: string | null;
    twitter: string | null;
    vertical: number;
}

export const developers: DeveloperCardProps[] = [
    {
        name: 'Aaditya Nair',
        image: require('@assets/images/developers/app/nair.jpg'),
        linkedin: 'https://www.linkedin.com/in/arnair24/',
        github: 'https://github.com/f1ytrp',
        instagram: 'https://www.instagram.com/nair_aad1tya/',
        behance: null,
        twitter: null,
        vertical: 1,

    },
    {
        name: 'Aditya Bhardwaj',
        image: require('@assets/images/developers/app/aditya.jpg'), 
        linkedin: 'https://www.linkedin.com/public-profile/settings',
        github: 'https://github.com/AdityaBhardwaj06',
        instagram: 'https://www.instagram.com/bhard_waj_aditya?igsh=MXhlZGxpNWl6dzQ1dw==',
        behance: null,
        twitter: null,
        vertical: 1,

    },
    {
        name: 'Deep Raj',
        image: require('@assets/images/developers/app/deep.jpg'), 
        linkedin: 'https://www.linkedin.com/in/deep-raj-97ba1b357/',
        github: 'https://github.com/DeepRaj7408',
        instagram: null,
        behance: null,
        twitter: null,
        vertical: 1,

    },
    {
        name: 'Nandan Bali',
        image: require('@assets/images/developers/app/nandan.jpg'), 
        linkedin: 'https://www.linkedin.com/in/nandan-bali-224608323',
        github: 'https://github.com/NandanBali',
        instagram: 'https://www.instagram.com/nanballz06',
        twitter: 'https://x.com/RonTheDog',
        behance: null,
        vertical: 1,
    },
    {
        name: 'Shreyas Gupta ',
        image: require('@assets/images/developers/app/shreyas.jpg'), 
        linkedin: 'https://www.linkedin.com/in/shreyas-gupta-1980491b0',
        github: 'https://github.com/Shreyas-Gupta06',
        instagram: null,
        twitter: null,
        behance: null,
        vertical: 1,
    },

    {
        name: 'Darsh Patel',
        image: require('@assets/images/developers/back/darsh.jpg'), 
        linkedin: 'www.linkedin.com/in/darsh-patel-4967bb333',
        github: 'https://github.com/DarshPatel127/',
        instagram: 'https://www.instagram.com/darshpatel.73',
        twitter: null,
        behance: null,
        vertical: 2,
    },
    {
        name: 'Nishchay Choudhary',
        image: require('@assets/images/developers/back/nishchay.jpg'), 
        linkedin: 'https://www.linkedin.com/in/nishchay-choudhary-7715792b6?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
        github: 'https://github.com/Nishh7009',
        instagram: null,
        twitter: null,
        behance: null,
        vertical: 2,
    },
    {
        name: 'Medhansh Khandelwal',
        image: require('@assets/images/developers/back/medhansh.jpg'), 
        linkedin: 'https://www.linkedin.com/in/medhansh-khandelwal-006333228/',
        github: 'https://github.com/medhu123/',
        instagram: 'https://www.instagram.com/medhuuu_vada/',
        twitter: 'https://x.com/medhuuu_vada',
        behance: null,
        vertical: 2,
    },
    {
        name: 'Rishit Verma',
        image: require('@assets/images/developers/back/rishit.jpg'), 
        linkedin: 'https://www.linkedin.com/in/rishit-verma-1038602b3',
        github: 'https://github.com/rish-kun',
        instagram: 'https://www.instagram.com/rish.kun',
        twitter: null,
        behance: null,
        vertical: 2,
    },
    {
        name: 'N.S.A. RAIYYAN',
        image: require('@assets/images/developers/design/raiyyan.jpg'), 
        linkedin: 'https://www.linkedin.com/in/abdulla-raiyyan-b69a81321?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
        github: null,
        instagram: 'https://www.instagram.com/raiyyan587/',
        twitter: null,
        behance: null,
        vertical: 3,
    },
    {
        name: 'Soma Saketh Ram',
        image: require('@assets/images/developers/design/soma.jpg'),
        linkedin: 'https://www.linkedin.com/in/soma-saketh-ram-b29815338?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
        github: null,
        instagram: 'https://www.instagram.com/soma_saketh_ram/profilecard/?igsh=MWRkaWo3ZjRzNGp6YQ==',
        twitter: null,
        behance: null,
        vertical: 3,
    },
    {
        name: 'Vaibhav Menon',
        image: require('@assets/images/developers/design/vaibhav.jpg'), 
        linkedin: 'https://www.linkedin.com/in/vaibhav-menon-858288322',
        github: 'https://github.com/ElectroWaltx',
        instagram: 'https://www.instagram.com/ouaibub?igsh=MTJ1d3dwZ21sMDRyOQ==',
        twitter: null,
        behance: null,
        vertical: 3,
    },
    {
        name: 'Vannya V Yagwin',
        image: require('@assets/images/developers/design/vanya.jpg'), 
        linkedin: 'https://www.linkedin.com/in/muskan-bhagotra-520b79327/',
        github: null,
        instagram: 'https://www.instagram.com/thevannya/',
        twitter: 'https://x.com/V_annz',
        behance: 'https://www.behance.net/muskanbhagotra',
        vertical: 3,
    },



];