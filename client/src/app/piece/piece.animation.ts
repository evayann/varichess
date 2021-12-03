import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

export const position =
    trigger('position', [
        state('live', style({
            transform: "translate({{ x }}%, {{ y }}%) rotate(0deg)",
            transformOrigin: "bottom center",
            opacity: 1
        }),  {params: {x: 0, y: 0}}),
        transition(
            'live => dead', 
            animate('{{ time }}ms ease-out', keyframes([
                style({
                    transform: "translate({{ x }}%, {{ y }}%) rotate(0deg)",
                    transformOrigin: "bottom center",
                    opacity: 1,
                    offset: .5
                }),
                style({
                    transform: "translate({{ x }}%, {{ y }}%) rotate(90deg)",
                    transformOrigin: "bottom center",
                    opacity:0,
                    offset: 1
                })
            ])),
            {params: {x: 0, y: 0, time: 1000}})
    ]);