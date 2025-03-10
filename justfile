default:
    just --list --unsorted

install:
    pnpm install
    pnpm exec playwright install

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

test-ui:
    pnpm test:ui

clean-plan:
    git clean -fxdn

clean-danger:
    git clean -fxd


force-kill-dev-servers:
    for port in {3000..3005}; do lsof -ti :$port | xargs kill -9 2>/dev/null; done

tree-src:
    tree -h -I "node_modules|.git|dist|.cache|docs" | cat