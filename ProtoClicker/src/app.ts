window.onload = () =>
{
    var p: ProtoClicker = new ProtoClicker(
        800, //window.innerWidth * window.devicePixelRatio,
        600, //window.innerHeight * window.devicePixelRatio,
        "content"
    );

    window.onresize = (e: UIEvent) =>
    {
        p.onResize(
            800, //window.innerWidth * window.devicePixelRatio,
            600 //window.innerHeight * window.devicePixelRatio
        );
    };
}