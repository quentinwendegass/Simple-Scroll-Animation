(function () {
    // Element 1
    Scroll.opacity("element1", 1, 0.5).start();

    // Element 2
    Scroll.left("element2", 40, 0.75, 0, 0.25, "%").start();
    Scroll.scale("element2", 1.25, 0.5, 0, 0).start();

    // Element 3
    Scroll.rotation("element3", 360).setUnit("deg").start();

    //Element 4
    Scroll.width("element4")
        .setUnit("%")
        .setEnd(
            {
                values: [80],
                offset: 0.9
            })
        .setStart(
            {
                values: [30],
                offset: 0.1
            })
        .start();
})();