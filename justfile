default:
    just --list --unsorted

force-kill-dev-servers:
    for port in {3000..3005}; do lsof -ti :$port | xargs kill -9 2>/dev/null; done

tree-src:
    tree -h -I "node_modules|.git|dist|.cache|docs" | cat