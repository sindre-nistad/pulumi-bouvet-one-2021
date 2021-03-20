import * as fs from 'fs'
import _asciidoctor from '@asciidoctor/core'
// @ts-ignore
const revealJs = require('@asciidoctor/reveal.js')
const asciidoctor = _asciidoctor()

revealJs.register()

export const convertSlides = (): string => {
  const html = asciidoctor.convert(fs.readFileSync('presentation/no_nb.adoc'), {
    backend: 'reveal.js',
    standalone: true,
    to_file: false
  }) as string

  return html
      // Make the Paths asciidoctor-revealjs fetches consistent with those provided by the CDN
      .replace('/js/', '/')
      .replace('/css/', '/')
}
