"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveTenantId = void 0;
const common_1 = require("@nestjs/common");
exports.ActiveTenantId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.tenantId;
});
//# sourceMappingURL=tenant.decorator.js.map