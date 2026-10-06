import json, re

with open('tour-details.json', encoding='utf-8') as f:
    details = json.load(f)

# summary data scraped from the homepage tour cards (slug -> summary)
summary = {
    "ngu-chi-son": dict(name="Ngũ Chỉ Sơn 2858m", tag="Tour xe giường nằm", duration="2N2Đ", difficulty="8/10",
        price="2.900.000 ₫", desc="Khám phá dãy núi năm ngón tay xòe thẳng lên trời được mệnh danh là hùng vĩ bậc nhất vùng Tây Bắc, vượt qua những vách đá và dốc gỗ thô mộc giữa biển mây."),
    "fansipan": dict(name="Fansipan 3143m", tag="Tour xe giường nằm", duration="2N2Đ", difficulty="7/10",
        price="2.900.000 ₫", desc="Đồng hành bứt phá giới hạn bản thân, vượt 15km đường rừng núi kỳ vĩ để mang về chiếc huy chương lưu niệm đoạt đỉnh Nóc nhà Đông Dương."),
    "nam-kang-ho-tao": dict(name="Nam Kang Ho Tao 2881m", tag="Tour xe giường nằm", duration="3N3Đ", difficulty="10/10",
        price="4.700.000 ₫", desc="Vượt qua \"hung thần Tây Bắc\" hiểm trở bậc nhất Việt Nam. Cung đường dành riêng cho những trekker kiên cường muốn bứt phá giới hạn tối đa của bản thân."),
    "can-chu": dict(name="🌟Combo 2 đỉnh: Chu Va 12 & Can Chua Thìa Sảng", tag="Tour xe giường nằm", duration="2N2Đ", difficulty="9/10",
        price="3.200.000 ₫", desc="Trải nghiệm cung đường mạo hiểm độc lạ Lai Châu. Thử thách thể lực cực đại chinh phục combo 2 đỉnh Chu Va 12 và Cán Chua Thìa Sảng khuất sâu giữa cánh rừng nguyên sinh kỳ vĩ."),
    "can-chu-mieu": dict(name="🌟Combo 3 đỉnh: Miêu Thạch Sơn - Chu Va 12 - Can Chua Thìa Sảng", tag="Tour xe giường nằm", duration="3N3Đ", difficulty="10/10",
        price="4.700.000 ₫", desc="Bài thi \"tốt nghiệp\" đỉnh cao dành cho các trekker chuyên sâu. Vượt dốc thẳng đứng liên hoàn, trải nghiệm lán hang đá độc nhất và thử thách lòng can đảm bứt phá chuỗi 3 đỉnh núi hiểm trở bậc nhất Việt Nam."),
    "nui-muoi": dict(name="Núi Muối 2215m", tag="Thiên Đường Săn Mây", duration="2N2Đ", difficulty="6/10",
        price="2.700.000 ₫", desc="Hành trình trekking vừa sức cắt bỏ chóp Ky Quan San, tập trung trọn vẹn vào trải nghiệm lán nghỉ 2215m để săn hoàng hôn, bình minh rực rỡ và check-in cùng đại dương mây cuồn cuộn."),
    "ta-chi-nhu": dict(name="Tà Chì Nhù 2979m", tag="Tour Bán Chạy", duration="2N2Đ", difficulty="7/10",
        price="2.700.000 ₫", desc="Đỉnh Tà Chì Nhù là thiên đường săn mây với khung cảnh thơ mộng và không khí trong lành giữa núi rừng."),
    "lao-than": dict(name="Lảo Thẩn 2860m", tag="Tour Bán Chạy", duration="2N2Đ", difficulty="5/10",
        price="2.700.000 ₫", desc="Lảo Thẩn là lựa chọn lý tưởng cho người mới trekking với biển mây hùng vĩ và khung cảnh yên bình ở Y Tý."),
    "ta-chi-nhu-nam-nghiep": dict(name="Tà Chì Nhù (Nậm Nghiệp) 2979m", tag="Tour Bán Chạy", duration="2N2Đ", difficulty="5/10",
        price="2.700.000 ₫", desc="Tà Chì Nhù hướng Nậm Nghiệp là lựa chọn lý tưởng cho người mới trekking với cảnh quan đa dạng và đồi hoa Chi Pâu rực rỡ."),
    "lung-cung": dict(name="Lùng Cúng 2913m", tag="Tour Bán Chạy", duration="2N2Đ", difficulty="6/10",
        price="2.700.000 ₫", desc="Lùng Cúng mang đến cảm giác mộc mạc, nguyên sơ cùng trải nghiệm văn hóa bản địa đặc trưng vùng Tây Bắc."),
    "phu-sa-phin": dict(name="Phu Sa Phìn 2963m", tag="Tour Bán Chạy", duration="2N2Đ", difficulty="7/10",
        price="2.800.000 ₫", desc="Phu Sa Phìn là hành trình trekking khám phá rừng rêu ma mị và chinh phục sống lưng khủng long hùng vĩ nhất Tây Bắc."),
    "samu": dict(name="Samu 2756m", tag="Tour Bán Chạy", duration="2N2Đ", difficulty="7.5/10",
        price="2.800.000 ₫", desc="Chinh phục đỉnh Samu với địa hình mềm mại và những cánh rừng nguyên sinh còn giữ được vẻ hoang sơ nguyên bản."),
    "nhiu-co-san": dict(name="Nhìu Cồ San 2965m", tag="Tour Hot", duration="2N2Đ", difficulty="8/10",
        price="2.700.000 ₫", desc="Trải nghiệm cung đường mây trắng và địa hình núi đá độc đáo tại Nhìu Cồ San – điểm đến mới nổi gần Sa Pa."),
    "ta-lien-son": dict(name="Tả Liên Sơn 2996m", tag="Tour xe giường nằm", duration="2N2Đ", difficulty="8.5/10",
        price="3.000.000 ₫", desc="Tả Liên Sơn - rừng cổ tích trên mây với thảm thực vật nguyên sinh cực kì đa dạng, đỉnh núi cao thứ 6 Việt Nam."),
    "ky-quan-san": dict(name="Ky Quan San 3046m", tag="Tour Hot", duration="2N2Đ", difficulty="8.5/10",
        price="3.500.000 ₫", desc="Bạch Mộc Lương Tử là một trong những cung núi đẹp nhất Việt Nam, nổi bật với cảnh bình minh và biển mây cuồn cuộn."),
    "putaleng2d": dict(name="Putaleng 3049m (2 Ngày)", tag="Tour xe giường nằm", duration="2N2Đ", difficulty="8/10",
        price="3.000.000 ₫", desc="Leo hướng Tả Lèng - Hồ Thầu, chinh phục đỉnh Putaleng – Chiêm ngưỡng vẻ đẹp rừng nguyên sinh và thảm hoa đỗ quyên rực rỡ."),
    "putaleng": dict(name="Putaleng 3049m (3 Ngày)", tag="Tour xe giường nằm", duration="3N2Đ", difficulty="9/10",
        price="3.800.000 ₫", desc="Leo hướng Tả Lèng - Sì Thầu Chải, chinh phục đỉnh Putaleng – ngắm trọn vẹn sắc hoa trên đỉnh Đỗ Quyên rực rỡ, trải nghiệm văn hoá bản làng Sì Thầu Chải."),
    "quang-binh": dict(name="Quảng Bình - Bí mật Hang E", tag="Tour xe giường nằm", duration="1 ngày 2 đêm", difficulty="5/10",
        price="3.300.000 ₫", desc="Chinh phục dòng sông ngầm ngọc bích giữa vùng lõi Phong Nha, trải nghiệm bơi hang, khám phá hệ thống thạch nhũ kỳ vĩ và tận hưởng không gian huyền bí của Hang E."),
    "cua-tu": dict(name="Cửa Tử - Thái Nguyên", tag="Tour Mùa Hè", duration="Trong ngày", difficulty="5/10",
        price="900.000 ₫", desc="Chinh phục máng trượt đá tự nhiên, tắm thác Thiên Đường và trải nghiệm cảm giác cực đã giữa dòng suối mát lạnh."),
    "ham-lon": dict(name="Hàm Lợn 462m", tag="Tour Siêu Hot", duration="Trong ngày", difficulty="3/10",
        price="100.000 ₫", desc="Hàm Lợn là lựa chọn lý tưởng cho người mới bắt đầu trekking, chỉ cách Hà Nội 40km với cảnh quan tuyệt đẹp."),
    "ham-lon-suoi": dict(name="Hàm Lợn - Suối 462m", tag="Tour Mùa Hè", duration="Trong ngày", difficulty="5/10",
        price="150.000 ₫", desc="Hàm Lợn - Suối là lựa chọn lý tưởng cho người thích khám phá thiên nhiên, thích suối, thích thác nước."),
    "da-giang": dict(name="Đà Giang - Hoà Bình", tag="Tour Mùa Hè", duration="Trong ngày", difficulty="4/10",
        price="950.000 ₫", desc="Cùng GLT khám phá Đà Giang với những hoạt động thú vị như khám phá hang động, hồ mắt ngọc và tắm hồ."),
    "na-hang": dict(name="Na Hang - Thác Nặm Me", tag="Tour Mùa Hè", duration="2N2Đ", difficulty="3/10",
        price="2.400.000 ₫", desc="Hành trình chinh phục \"Hạ Long giữa đại ngàn\", lội suối khám phá hệ thống 15 tầng thác Nặm Me hùng vĩ và kỳ ảo."),
    "ba-vi": dict(name="VQG Ba Vì 1296m", tag="Tour Mùa Hè", duration="Trong ngày", difficulty="3/10",
        price="700.000 ₫", desc="Tận hưởng bầu không khí trong lành, khám phá rừng già và tận hưởng dòng suối mát lạnh giữa rừng ngay sát Hà Nội."),
}

order = ["ngu-chi-son","fansipan","nam-kang-ho-tao","can-chu","can-chu-mieu","nui-muoi","ta-chi-nhu",
         "lao-than","ta-chi-nhu-nam-nghiep","lung-cung","phu-sa-phin","samu","nhiu-co-san","ta-lien-son",
         "ky-quan-san","putaleng2d","putaleng","quang-binh","cua-tu","ham-lon","ham-lon-suoi","da-giang",
         "na-hang","ba-vi"]

tours = []
for slug in order:
    s = summary[slug]
    d = details.get(slug, {})
    gallery_local = [f"/images/tours/{slug}/anh-dep/{i}.jpg" for i in range(1, 5)]
    tours.append({
        "slug": slug,
        "name": s["name"],
        "tag": s["tag"],
        "duration": s["duration"],
        "difficulty": s["difficulty"],
        "price": s["price"],
        "shortDesc": s["desc"],
        "image": f"/images/tours/{slug}/1.jpg",
        "gallery": gallery_local,
        "introTitle": d.get("introTitle") or f"Đôi chút về {s['name']}",
        "introText": d.get("introText", "").strip(),
        "leaderTip": d.get("leaderTip", "").replace("⚠️ Cảnh báo địa hình: ", "").strip(),
        "priceNote": d.get("priceNote", "").strip(),
        "itinerary": d.get("itinerary", []),
    })

with open('../data/tours.json', 'w', encoding='utf-8') as f:
    json.dump(tours, f, ensure_ascii=False, indent=2)

print("Wrote", len(tours), "tours")
