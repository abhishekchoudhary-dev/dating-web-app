interface AvatarComponentProps {
    className?: string;
    src: string;
}

export default function Avatar({ className = "", src, }: AvatarComponentProps) {
    return (
        <div className="avatar">
            <div className={`${className}`}>
                <img src={src} />
            </div>
        </div>
    );
}