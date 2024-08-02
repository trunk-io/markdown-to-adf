import { markdownToADF } from ".."
import {expect, describe, it} from "@jest/globals"
import type { ADFParagraphNode, ADFTextNode } from "../types"

describe('Isolated Markdown', () => {

    it('can parse Headings', async () => {
        for (let i = 1; i < 7; i++) {
            const md = '#'.repeat(i) + ' Heading'
            const adf = await markdownToADF(md)
            expect(adf).toBeDefined;
            expect(adf.content).toBeDefined;
            expect(adf.content.length).toEqual(1);
            expect(adf.content[0].type).toEqual('heading')
            // @ts-expect-error
            expect(adf.content[0]['attrs']['level']).toEqual(i)
        }
    })

    it('can parse Paragraphs', async () => {
        const md = `this is a paragraph`
        const adf = await markdownToADF(md)
        expect(adf).toBeDefined
        expect(adf.content).toBeDefined
        expect(adf.content.length).toEqual(1)
        expect(adf.content[0].type).toEqual('paragraph')
        expect((adf.content[0] as ADFParagraphNode).content.length).toEqual(1)
        expect((adf.content[0] as ADFParagraphNode).content[0].type).toEqual('text')
        expect(((adf.content[0] as ADFParagraphNode).content[0] as ADFTextNode).text).toEqual(md)
    })

    it('can parse links', async () => {
        const md = `[this is a link](https://example.com)`
        const adf = await markdownToADF(md)
        expect(adf).toBeDefined
        expect(adf.content).toBeDefined
        expect(adf.content.length).toEqual(1)
        expect(adf.content[0].type).toEqual('paragraph')
        expect((adf.content[0] as ADFParagraphNode).content.length).toEqual(1)
        expect((adf.content[0] as ADFParagraphNode).content[0].type).toEqual('text')
        expect(((adf.content[0] as ADFParagraphNode).content[0] as ADFTextNode).text).toEqual('this is a link')
        expect(((adf.content[0] as ADFParagraphNode).content[0] as ADFTextNode).marks?.length).toEqual(1)
        expect(((adf.content[0] as ADFParagraphNode).content[0] as ADFTextNode).marks?.[0].type).toEqual('link')
        // @ts-expect-error
        expect(((adf.content[0] as ADFParagraphNode).content[0] as ADFTextNode).marks?.[0]['attrs']['href']).toEqual('https://example.com')
    })
})
