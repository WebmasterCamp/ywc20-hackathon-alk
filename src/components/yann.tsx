import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Yann() {
    return (
        <div className="flex justify-center mb-20">
            <div className="w-[1200px]">
                <div className="mb-12">
                    <h1 className="text-5xl font-bold text-brown-normal mb-4">
                        เขียนยันต์
                    </h1>
                    <p className="text-xl font-medium text-brown-normal">
                        พิธีกรรมมากมาย สะดวก รวดเร็ว ใกล้คุณ
                    </p>
                </div>
                <div className="grid lg:grid-cols-3 grid-cols-1 gap-6">
                    <div>
                        <img
                            src="/images/watt1.png"
                            alt="yann"
                            className="w-full aspect-[4/3] object-center object-cover mb-6"
                        />
                        <div className="mb-6 bg-[#F2C5BD] text-[#533928] flex items-center justify-center gap-2 w-fit rounded-full px-3">
                            <div className="h-[5px] aspect-[1/1] rounded-full bg-[#533928]"></div>
                            <p>ความปลอดภัย</p>
                        </div>
                        <h1 className="text-3xl mb-3 font-bold">วัดยานนาวา</h1>
                        <p className="mb-12">
                            ขึ้นชื่อเรื่องการเจิมรถเพื่อความปลอดภัยและโชคลาภ
                            โดยเฉพาะผู้ประกอบการที่เดินทางบ่อยและค้าขาย
                        </p>
                        <Link href="#">
                            <div className="flex items-center">
                                <p className="text-brown-normal lg:hidden mr-2">จองเลย</p> <ArrowRight className="text-brown-normal" />
                            </div>
                        </Link>
                    </div>
                    <div>
                        <img
                            src="/images/watt2.png"
                            alt="yann"
                            className="w-full aspect-[4/3] object-center object-cover mb-6"
                        />
                        <div className="mb-6 bg-[#F2C5BD] text-[#533928] flex items-center justify-center gap-2 w-fit rounded-full px-3">
                            <div className="h-[5px] aspect-[1/1] rounded-full bg-[#533928]"></div>
                            <p>ความปลอดภัย</p>
                        </div>
                        <h1 className="text-3xl mb-3 font-bold">วัดศาลเจ้า</h1>
                        <p className="mb-12">
                            วัดศาลเจ้า มีพระเกจิอาจารย์ “หลวงพ่อทองสุข”
                            <br />
                            ที่โด่งดังเรื่องเมตตาและคุ้มครองภัย
                        </p>
                        <Link href="#">
                            <div className="flex items-center">
                                <p className="text-brown-normal lg:hidden mr-2">จองเลย</p> <ArrowRight className="text-brown-normal" />
                            </div>
                        </Link>
                    </div>
                    <div>
                        <img
                            src="/images/watt3.png"
                            alt="yann"
                            className="w-full aspect-[4/3] object-center object-cover mb-6"
                        />
                        <div className="mb-6 bg-[#F2C5BD] text-[#533928] flex items-center justify-center gap-2 w-fit rounded-full px-3">
                            <div className="h-[5px] aspect-[1/1] rounded-full bg-[#533928]"></div>
                            <p>การเงิน</p>
                        </div>
                        <h1 className="text-3xl mb-3 font-bold">
                            วัดสว่างอารมณ์
                        </h1>
                        <p className="mb-12">
                            ได้รับความนิยมสูงในการขอพรโชคลาภ
                            <br />
                            และเจิมรถใหม่เพื่อความมั่งคั่ง
                        </p>
                        <Link href="#">
                            <div className="flex items-center">
                                <p className="text-brown-normal lg:hidden mr-2">จองเลย</p> <ArrowRight className="text-brown-normal" />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
