import LogoSrc from 'public/square-pants-logo.svg';

interface Iprops {
    size?: number | string;
    circle?: boolean;
}

export default function Logo(props: Iprops) {

    const { size = 50, circle = false } = props;

    return (
        <>
            <div
                style={{
                    backgroundImage: `url(${LogoSrc})`,
                    height: size,
                    width: size,
                    backgroundSize: "cover",
                    borderRadius: circle ? '50%' : '0%',
                }}
            />
        </>
    );
}
