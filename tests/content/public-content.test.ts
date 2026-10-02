import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'
import { programs } from '../../src/lib/programs'

function readSource(path: string) {
  return ts.createSourceFile(
    path,
    readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )
}

function literalLinks(path: string) {
  const links: string[] = []
  const source = readSource(path)
  function visit(node: ts.Node) {
    if (
      ts.isPropertyAssignment(node)
      && node.name.getText(source) === 'href'
      && ts.isStringLiteral(node.initializer)
    ) {
      links.push(node.initializer.text)
    }
    if (
      ts.isJsxAttribute(node)
      && node.name.getText(source) === 'href'
      && node.initializer
      && ts.isStringLiteral(node.initializer)
    ) {
      links.push(node.initializer.text)
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  return links
}

test('program summaries describe activities without unsupported quantitative outcomes', () => {
  for (const program of programs) {
    const highlights = [
      program.impactValue,
      program.impactLabel,
      ...program.heroMetrics.flatMap(metric => [metric.value, metric.label]),
      ...program.sections.flatMap(section => section.items.map(item => item.value ?? '')),
    ]
    for (const highlight of highlights) {
      assert.doesNotMatch(highlight, /[0-9%]/, `${program.slug}: ${highlight}`)
    }
  }
})

test('program support links match the shared donation page and available directory/contact routes', () => {
  for (const program of programs) {
    assert.equal(program.donationHref, '/donate', program.slug)
    assert.ok(['/contact', '/merchants'].includes(program.secondaryCtaHref), program.slug)
  }
})

test('public navigation and onboarding links avoid absent routes and staging services', () => {
  const paths = [
    'src/components/layout/header.tsx',
    'src/components/layout/footer.tsx',
    'src/components/merchants/merchant-directory-client.tsx',
    'src/app/merchants/location-accuracy/page.tsx',
  ]
  for (const path of paths) {
    for (const href of literalLinks(path)) {
      const pathname = new URL(href, 'https://www.afribit.africa').pathname
      assert.ok(!['/maps', '/register'].includes(pathname), `${path}: ${href}`)
      assert.doesNotMatch(href, /https?:\/\/staging\./, `${path}: ${href}`)
    }
  }
  assert.equal(literalLinks(paths[0]).filter(href => href === '/merchants').length, 2)
  assert.ok(literalLinks(paths[1]).includes('/merchants'))
  assert.ok(literalLinks(paths[2]).includes('/contact'))
  assert.equal(literalLinks(paths[3]).filter(href => href === '/contact').length, 2)
})
