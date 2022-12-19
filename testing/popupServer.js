const http = require('http');
const filesystem = require('fs');
const mime = require('mime');

let popupMockContent;

// Reading the mock code for injection
filesystem.readFile(__dirname + '/popupMock.js', function (error, content) {
	if (!error) {
		popupMockContent = content;
	} else {
		throw error;
	}
});

function timestamp() {
	const x = new Date();
	return x.toLocaleTimeString();
}

function requestHandler(request, response) {
	let filePath;

	if (request.url === '/') {
		filePath = './popup.html';
	} else {
		filePath = './' + request.url;
	}
	const mimeType = mime.getType(filePath);

	filesystem.readFile(filePath, function (error, content) {
		let statusCode;

		if (error) {
			statusCode = error.code === 'ENOENT' ? 404 : 500;
			response.writeHead(statusCode);
			response.end();
		} else {
			// If the requested script is the popup script, the mock gets injected
			if (request.url === '/popup.js') {
				content = popupMockContent + content;
				console.log(
					`[127.0.0.1:${port}] - [${timestamp()}] Injected mock data`
				);
			}
			statusCode = 200;
			response.writeHead(200, {'Content-Type': mimeType});
			response.write(content, 'utf-8');
			response.end();
		}
		console.log(
			`[127.0.0.1:${port}] - [${timestamp()}] "GET ${
				request.url
			}" ${statusCode}`
		);
	});
}

const port = process.env.npm_config_port ? process.env.npm_config_port : 8000;

http.createServer(requestHandler).listen(port);
console.log(`Server running at http://localhost:${port}/\n`);
