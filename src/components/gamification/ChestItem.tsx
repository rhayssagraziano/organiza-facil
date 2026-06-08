export function ChestItem({ item }: { item: string }) {
    switch (item) {
        case 'coin': return (
            <><circle cx="50" cy="70" r="9" fill="#F59E0B" />
                <text x="50" y="74" textAnchor="middle" fontSize="10" fill="#78350F" fontWeight="bold">$</text></>
        );
        case 'heart': return (
            <path d="M50 77C50 77 40 69 40 63C40 60 42 58 44 58C46 58 48 60 50 62C52 60 54 58 56 58C58 58 60 60 60 63C60 69 50 77 50 77Z" fill="#FF6B6B" />
        );
        case 'star': return (
            <polygon points="50,60 52.5,67 60,67 54,71 56,78 50,74 44,78 46,71 40,67 47.5,67" fill="#F59E0B" />
        );
        case 'diamond': return (
            <polygon points="50,60 58,67 50,78 42,67" fill="#60A5FA" opacity="0.9" />
        );
        case 'flame': return (
            <path d="M50 78C46 75 42 70 42 65C42 61 45 59 47 61C46 58 48 56 50 57C52 56 54 58 53 61C55 59 58 61 58 65C58 70 54 75 50 78Z" fill="#F97316" />
        );
        default: return null;
    }
}
