"use strict";

const chai = require('chai');
const expect = chai.expect;

const Hapi = require('hapi');
const HapiForwardedFor = require('..');

describe('x-forwarded-for -> remoteAddress', function () {
    let server;
    before(async () => {
        server = new Hapi.Server();
        server.route({
            method: 'GET',
            path: '/',
            handler: (request, h) => {
                return request.info.remoteAddress;
            }
        });
        await server.register({ plugin: HapiForwardedFor });
    });

    it('single address', async () => {
        const requestOptions = {
            method: 'GET',
            url: '/',
            headers: {
                'x-forwarded-for': '22.0.0.1'
            }
        };
        let res = await server.inject(requestOptions);
        expect(res.result).to.equal('22.0.0.1');
    });

    it('multiple address', async () => {
        const requestOptions = {
            method: 'GET',
            url: '/',
            headers: {
                'x-forwarded-for': '22.0.0.3, 22.0.0.2, 22.0.0.1'
            }
        };
        let res = await server.inject(requestOptions);
        expect(res.result).to.equal('22.0.0.3');
    });

    it('no address', async () => {
        const requestOptions = {
            method: 'GET',
            url: '/'
        };
        let res = await server.inject(requestOptions);
        expect(res.statusCode).to.equal(200);
        expect(res.result).to.equal('127.0.0.1');
    });
});