export default function Sprite({image, data, position}) {
    const {x, y, h, w} = data;
    return (
        <div
            style={{
                position: "absolute",
                left: position.x,
                top: position.y,
                height: `${h}px`,
                width: `${w}px`,
                backgroundImage: `url(${image})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: `-${x}px -${y}px`
            }}
        > <p style={{paddingLeft: "30px"}}> 3 </p> </div>
    );
}