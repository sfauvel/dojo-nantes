import { VM, VMDevice } from "./vm";

describe("when", () => {
    [0x12, 0x13].forEach((value) =>
        it(`LIT should ${value} next byte in stack`, () => {
            const vm = new VM();
            const program = `\x80${String.fromCodePoint(value)}`;
            vm.execute(program);

            expect(vm.pop()).toBe(value);
        })
    );

    it(`Two LIT should push two bytes in stack`, () => {
        const vm = new VM();
        const program = `\x80\x12\x80\x13`;
        vm.execute(program);

        expect(vm.pop()).toBe(0x13);
        expect(vm.pop()).toBe(0x12);
    });

    it(`POP should pop one byte from stack`, () => {
        const vm = new VM();
        const program = `\x80\x12\x80\x13\x02`;
        vm.execute(program);

        expect(vm.pop()).toBe(0x12);
    });

    it(`DEO should write one byte to device`, () => {
        const device = new VMDevice();
        const vm = new VM(device);
        const program = `\x80\x12\x80\x18\x17`;
        vm.execute(program);

        expect(device.get(0x08)).toEqual([0x12]);
    });

    it(`DEI should read one byte from device`, () => {
        const device = new VMDevice();
        device.in = [0x42];
        const vm = new VM(device);
        const program = `\x80\x12\x16`;
        vm.execute(program);

        expect(vm.pop()).toEqual(0x42);
    });

    it('assert subroutine returns some value', () => {
        const vm = new VM();
        const subroutine = `\x80\x12`;
        const program = '\x80\x04\x0e\x80\x12\x08' + subroutine + '\x6d';
        vm.execute(program);

        expect(vm.pop()).toEqual(0x01);
    })
});
