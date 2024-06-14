const fs = require('fs');
const Util = require('./util.js');

exports.default = async function (context) {
	if (process.env.ELECTRON_SKIP_NOTARIZE) {
		return;
	};

	fs.chmodSync(context.path, '777');

	const cmd = [
		`azuresigntool sign`,
		`--description-url "${context.site}"`,
		`--file-digest sha384`,
		`--timestamp-digest sha384`,
		`--timestamp-rfc3161 http://timestamp.digicert.com`,
		`--azure-key-vault-url "${process.env.AZURE_KEY_VAULT_URI}"`,
		`--azure-key-vault-client-id "${process.env.AZURE_CLIENT_ID}"`,
		`--azure-key-vault-tenant-id "${process.env.AZURE_TENANT_ID}"`,
		`--azure-key-vault-client-secret "${process.env.AZURE_CLIENT_SECRET}"`,
		`--azure-key-vault-certificate "${process.env.AZURE_CERT_NAME}"`,
		`--verbose`,
		`"${context.path}"`,
	].join(' ');

	return await Util.execPromise(cmd);
};