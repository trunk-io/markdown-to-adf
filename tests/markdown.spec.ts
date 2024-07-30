import { expect } from "chai"
import { markdownToADF } from "../src"
import type { ADFParagraphNode, ADFTextNode } from "../src/types"

describe('Isolated Markdown', () => {

    it('can parse Headings', () => {
        for (let i = 1; i < 7; i++) {
            const md = '#'.repeat(i) + ' Heading'
            const adf = markdownToADF(md)
            expect(adf).not.to.be.undefined
            expect(adf.content).not.to.be.undefined
            expect(adf.content.length).to.equal(1)
            expect(adf.content[0].type).to.equal('heading')
            expect(adf.content[0]['attrs']['level']).to.equal(i)
        }
    })

    it('can parse Paragraphs', () => {
        const md = `this is a paragraph`
        const adf = markdownToADF(md)
        expect(adf).not.to.be.undefined
        expect(adf.content).not.to.be.undefined
        expect(adf.content.length).to.equal(1)
        expect(adf.content[0].type).to.equal('paragraph')
        expect((adf.content[0] as ADFParagraphNode).content.length).to.equal(1)
        expect((adf.content[0] as ADFParagraphNode).content[0].type).to.equal('text')
        expect(((adf.content[0] as ADFParagraphNode).content[0] as ADFTextNode).text).to.equal(md)
    })

    it('can parse links', () => {
        const md = `[this is a link](https://example.com)`
        const adf = markdownToADF(md)
        expect(adf).not.to.be.undefined
        expect(adf.content).not.to.be.undefined
        expect(adf.content.length).to.equal(1)
        expect(adf.content[0].type).to.equal('paragraph')
        expect((adf.content[0] as ADFParagraphNode).content.length).to.equal(1)
        expect((adf.content[0] as ADFParagraphNode).content[0].type).to.equal('text')
        expect(((adf.content[0] as ADFParagraphNode).content[0] as ADFTextNode).text).to.equal('this is a link')
        expect(((adf.content[0] as ADFParagraphNode).content[0] as ADFTextNode).marks?.length).to.equal(1)
        expect(((adf.content[0] as ADFParagraphNode).content[0] as ADFTextNode).marks?.[0].type).to.equal('link')
        expect(((adf.content[0] as ADFParagraphNode).content[0] as ADFTextNode).marks?.[0]['attrs']['href']).to.equal('https://example.com')
    })
})