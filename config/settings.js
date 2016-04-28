/*******************************************************************************
 * Copyright (c) 2014 IBM Corp.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * and Eclipse Distribution License v1.0 which accompany this distribution.
 *
 * The Eclipse Public License is available at
 *   http://www.eclipse.org/legal/epl-v10.html
 * and the Eclipse Distribution License is available at
 *   http://www.eclipse.org/org/documents/edl-v10.php.
 *
 * Contributors:
 *   Bryan Boyd - Initial implementation 
 *******************************************************************************/

var config = {
	iot_deviceType: "deliverybox",     // replace with your deviceType
	iot_deviceOrg: "yo44cr",       // replace with your IoT Foundation organization
	iot_deviceSet: [               // replace with your registered device(s)
		{ deviceId: "1", token: "deliverybox" },   
		{ deviceId: "2", token: "deliverybox" },
		{ deviceId: "3", token: "deliverybox" },
		{ deviceId: "4", token: "deliverybox" },
		{ deviceId: "5", token: "deliverybox" },
		{ deviceId: "6", token: "deliverybox" },
		{ deviceId: "7", token: "deliverybox" },
		{ deviceId: "8", token: "deliverybox" },
		{ deviceId: "9", token: "deliverybox" }
	],
	iot_apiKey: "a-yo44cr-f0vg4m9tyw",    // replace with the key for a generated API token
	iot_apiToken: "@RYWTeYoEi@VVJHWg!",  // replace with the generated API token

};

try {
	module.exports = config;
} catch (e) { window.config = config; }
