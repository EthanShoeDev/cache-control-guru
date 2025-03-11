default:
    just --list --unsorted

install:
    pnpm install
    pnpm exec playwright install

dev:
    pnpm dev

lint:
    pnpm lint

lint-check:
    pnpm lint:check

fmt:
    pnpm fmt

fmt-check:
    pnpm fmt:check
    
knip:
    pnpm knip

knip-fix-danger:
    pnpm knip:fix:danger

test:
    pnpm test

test-unit:
    pnpm test:unit

test-e2e:
    pnpm test:e2e

test-e2e-ui:
    pnpm test:e2e:ui

clean-plan:
    git clean -fxdn

clean-danger:
    git clean -fxd

tree-src:
    tree -h -I "node_modules|.git|dist|.cache|docs" | cat
    

update-deps:
    pnpm dlx npm-check-updates --interactive --format group