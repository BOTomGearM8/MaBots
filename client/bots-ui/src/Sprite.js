import useWindowDimensions from './useWindowDimensions';

export default function Sprite({image, data, position, number, scale}) {
    const {x, y, h, w} = data;
    const { height, width } = useWindowDimensions();
    return (
        <div
            style={{
                position: "absolute",
                left: width*0.40 + position.x,
                top: height/7 + position.y,
                height: `${h}px`,
                width: `${w}px`,
                backgroundImage: `url(${image})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: `-${x}px -${y}px`,
                transform: `scale(${scale})`,
            }}
        > <p style={{paddingLeft: "25px"}}> {number} </p> </div>
    );
}