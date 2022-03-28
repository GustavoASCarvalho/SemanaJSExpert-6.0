import { jest, expect, describe, test, beforeEach } from '@jest/globals'
import { JSDOM } from 'jsdom'
import View from '../../../public/controller/js/view.js'

describe('#View - test suite for presentation layer', () => {
    const dom = new JSDOM()
    global.document = dom.window.document
    global.window = dom.window
    function makeBtnElement(
        { text, classList } = {
            text: '',
            classList: {
                add: jest.fn(),
                remove: jest.fn(),
            },
        }
    ) {
        return {
            onclick: jest.fn(),
            classList,
            innerText: text,
        }
    }

    beforeEach(() => {
        jest.resetAllMocks()
        jest.clearAllMocks()

        // jest.spyOn(
        //     document,
        //     document.querySelectorAll.name
        // ).mockReturnValue([makeBtnElement()])

        // jest.spyOn(document, document.getElementById.name).mockReturnValue(
        //     makeBtnElement()
        // )
    })

    test('#changeCommandButtonsVisibility - given hide=true it should add class "unassigned" to all buttons and remove onclick event', () => {
        const view = new View()
        const btn = makeBtnElement()

        jest.spyOn(document, 'querySelectorAll').mockReturnValue([btn])

        view.changeCommandButtonsVisibility()

        expect(btn.classList.add).toHaveBeenCalledWith('unassigned')
        expect(btn.onclick.name).toStrictEqual('onClickReset')
        expect(() => btn.onclick()).not.toThrow()
    })
    test('#changeCommandButtonsVisibility - given hide=false it should remove class "unassigned" to all buttons and add onclick event', () => {
        const view = new View()
        const btn = makeBtnElement()

        jest.spyOn(document, 'querySelectorAll').mockReturnValue([btn])

        view.changeCommandButtonsVisibility(false)

        expect(btn.classList.remove).toHaveBeenCalledWith('unassigned')
        expect(btn.onclick.name).toStrictEqual('onClickReset')
        expect(() => btn.onclick()).not.toThrow()
    })
    test('#onLoad', () => {
        const view = new View()

        jest.spyOn(
            view,
            view.changeCommandButtonsVisibility.name
        ).mockReturnValue()

        view.onLoad()

        expect(view.changeCommandButtonsVisibility).toHaveBeenCalled()
    })
})
