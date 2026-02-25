import { ImageSourcePropType } from "react-native";

export interface ContactCardProps {
    name: string,
    role: string,
    phone: string,
    email: string,
    image: ImageSourcePropType;
}

export const contacts: ContactCardProps[] = [
    {
        name: "Ishita Agrawal",
        role: "Registrations and Correspondence",
        phone: "+91 78040 51996",
        email: "pcr@bits-oasis.org",
        image: require('@assets/images/contact/Ishita.png')
    },
    {
        name: "Rahul Gupta",
        role: "Website, App and Payments",
        phone: "+91 93510 13052",
        email: "webmaster@bits-oasis.org",
        image: require('@assets/images/contact/Rahul.png')
    },
    {
        name: "Dhruv Maniar",
        role: "Sponsorships and Company Collaborations",
        phone: "+91 91675 32053",
        email: "dhruv@bits-oasis.org",
        image: require('@assets/images/contact/Dhruv.png')
    },
    {
        name: "Ayushmaan Kumar",
        role: "Logistics and Operations",
        phone: "+91 91675 32053",
        email: "controls@bits-oasis.org",
        image: require('@assets/images/contact/Ayushmaan.png')
    },
    {
        name: "Arshita Mittal",
        role: "Reception and Accommodation",
        phone: "+91 98777 07867",
        email: "recnacc@bits-oasis.org",
        image: require('@assets/images/contact/Arshita.png')
    },
    {
        name: "Pranav Deshpande",
        role: "Online Collaborations and Publicity",
        phone: "+91 86575 33580",
        email: "adp@bits-oasis.org",
        image: require('@assets/images/contact/Pranav.png')
    },
    {
        name: "Sajal Yadav",
        role: "President, Students' Union",
        phone: "+91 99900 67040",
        email: "president@pilani.bits-pilani.ac.in",
        image: require('@assets/images/contact/sajal.png')
    },
    {
        name: "Aditya Khandelwal",
        role: "General Secretary, Students' Union",
        phone: "+91 89556 65800",
        email: "gensec@pilani.bits-pilani.ac.in",
        image: require('@assets/images/contact/aditya.png')
    }
]

export default contacts;