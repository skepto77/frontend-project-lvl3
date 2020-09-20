install:
	npm install

start:
	npm run build

publish:
	npm publish --dry-run

lint:
	npx eslint .