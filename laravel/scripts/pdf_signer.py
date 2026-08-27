import sys
import os
import json
import base64
import shutil
import fitz

def map_visual_rect_to_page(page, vis_rect):
    rot = page.rotation % 360
    w_raw = page.mediabox.width
    h_raw = page.mediabox.height
    vx0, vy0, vx1, vy1 = vis_rect.x0, vis_rect.y0, vis_rect.x1, vis_rect.y1
    
    if rot == 0:
        return fitz.Rect(vx0, vy0, vx1, vy1), 0, 0
    elif rot == 90:
        return fitz.Rect(vy0, h_raw - vx1, vy1, h_raw - vx0), 90, 90
    elif rot == 180:
        return fitz.Rect(w_raw - vx1, h_raw - vy1, w_raw - vx0, h_raw - vy0), 180, 180
    elif rot == 270:
        return fitz.Rect(w_raw - vy1, vx0, w_raw - vy0, vx1), 270, 270
    return fitz.Rect(vx0, vy0, vx1, vy1), 0, 0

def format_and_fit_signer_name(name, box_len, max_fontsize=5.7, min_fontsize=4.8):
    if not name or not str(name).strip():
        return '', max_fontsize
    name_str = str(name).strip()
    w_at_max = fitz.get_text_length(name_str, fontname='helv', fontsize=max_fontsize)
    safe_w = max(10.0, box_len - 2.0)
    
    if w_at_max <= safe_w:
        return name_str, max_fontsize

    parts = name_str.split()
    if len(parts) == 2:
        abbr_name = f"{parts[0]} {parts[1][0]}."
        w_abbr = fitz.get_text_length(abbr_name, fontname='helv', fontsize=max_fontsize)
        if w_abbr <= safe_w:
            return abbr_name, max_fontsize
        return abbr_name, min(max_fontsize, max(min_fontsize, safe_w / (fitz.get_text_length(abbr_name, fontname='helv', fontsize=1.0))))
        
    elif len(parts) == 3:
        abbr1 = f"{parts[0]} {parts[1]} {parts[2][0]}."
        if fitz.get_text_length(abbr1, fontname='helv', fontsize=max_fontsize) <= safe_w:
            return abbr1, max_fontsize
            
        abbr2 = f"{parts[0]} {parts[1][0]}. {parts[2][0]}."
        w_abbr2 = fitz.get_text_length(abbr2, fontname='helv', fontsize=max_fontsize)
        if w_abbr2 <= safe_w:
            return abbr2, max_fontsize
        return abbr2, min(max_fontsize, max(min_fontsize, safe_w / (fitz.get_text_length(abbr2, fontname='helv', fontsize=1.0))))
        
    elif len(parts) >= 4:
        abbr_all = f"{parts[0]} " + ' '.join([p[0] + '.' for p in parts[1:]])
        w_all = fitz.get_text_length(abbr_all, fontname='helv', fontsize=max_fontsize)
        if w_all <= safe_w:
            return abbr_all, max_fontsize
        return abbr_all, min(max_fontsize, max(min_fontsize, safe_w / (fitz.get_text_length(abbr_all, fontname='helv', fontsize=1.0))))
        
    w_at_1 = fitz.get_text_length(name_str, fontname='helv', fontsize=1.0)
    fit_fs = safe_w / w_at_1
    return name_str, min(max_fontsize, max(min_fontsize, fit_fs))

def apply_pdf_signature(file_path, role, signature_base64, signer_name, etiket_category='Sipil', etiket_orientation='landscape'):
    if not os.path.exists(file_path) or not file_path.lower().endswith('.pdf'):
        print(f"Warning: PDF file not found: {file_path}")
        return

    try:
        img_bytes = None
        if signature_base64 and isinstance(signature_base64, str):
            try:
                base64_str = signature_base64.split(",", 1)[1] if ',' in signature_base64 else signature_base64
                img_bytes = base64.b64decode(base64_str)
            except Exception as e:
                print(f"Error decoding signature base64: {e}")

        doc = fitz.open(file_path)
        page = doc[0]
        
        cat_lower = str(etiket_category or '').lower()
        orient_lower = str(etiket_orientation or '').lower()

        coord_maps = {
            'diki_landscape': {
                'drafter':          {'img': fitz.Rect( 802.0, 628.0,  854.0, 693.0), 'text': fitz.Rect( 800.0, 695.0,  856.0, 708.0)},
                'foreman':          {'img': fitz.Rect( 858.0, 628.0,  910.0, 693.0), 'text': fitz.Rect( 856.0, 695.0,  912.0, 708.0)},
                'requester':        {'img': fitz.Rect( 915.0, 628.0,  967.0, 693.0), 'text': fitz.Rect( 913.0, 695.0,  969.0, 708.0)},
                'staff_user':       {'img': fitz.Rect( 915.0, 628.0,  967.0, 693.0), 'text': fitz.Rect( 913.0, 695.0,  969.0, 708.0)},
                'staff_epr':        {'img': fitz.Rect( 915.0, 628.0,  967.0, 693.0), 'text': fitz.Rect( 913.0, 695.0,  969.0, 708.0)},
                'dept':             {'img': fitz.Rect( 971.0, 628.0, 1023.0, 693.0), 'text': fitz.Rect( 969.0, 695.0, 1025.0, 708.0)},
                'dept_approval':    {'img': fitz.Rect( 971.0, 628.0, 1023.0, 693.0), 'text': fitz.Rect( 969.0, 695.0, 1025.0, 708.0)},
                'spv_user':         {'img': fitz.Rect( 971.0, 628.0, 1023.0, 693.0), 'text': fitz.Rect( 969.0, 695.0, 1025.0, 708.0)},
                'spv_dept':         {'img': fitz.Rect( 971.0, 628.0, 1023.0, 693.0), 'text': fitz.Rect( 969.0, 695.0, 1025.0, 708.0)},
                'supervisor_user':  {'img': fitz.Rect( 971.0, 628.0, 1023.0, 693.0), 'text': fitz.Rect( 969.0, 695.0, 1025.0, 708.0)},
                'supervisor':       {'img': fitz.Rect(1028.0, 628.0, 1080.0, 693.0), 'text': fitz.Rect(1026.0, 695.0, 1082.0, 708.0)},
                'spv_eng':          {'img': fitz.Rect(1028.0, 628.0, 1080.0, 693.0), 'text': fitz.Rect(1026.0, 695.0, 1082.0, 708.0)},
                'supervisor_eng':   {'img': fitz.Rect(1028.0, 628.0, 1080.0, 693.0), 'text': fitz.Rect(1026.0, 695.0, 1082.0, 708.0)},
                'manager':          {'img': fitz.Rect(1083.0, 628.0, 1135.0, 693.0), 'text': fitz.Rect(1082.0, 695.0, 1137.0, 708.0)},
                'manager_eng':      {'img': fitz.Rect(1083.0, 628.0, 1135.0, 693.0), 'text': fitz.Rect(1082.0, 695.0, 1137.0, 708.0)},
                'engineer':         {'img': fitz.Rect(1083.0, 628.0, 1135.0, 693.0), 'text': fitz.Rect(1082.0, 695.0, 1137.0, 708.0)},
                'factory_manager':  {'img': fitz.Rect(1028.0, 526.0, 1135.0, 592.0), 'text': fitz.Rect(1026.0, 594.0, 1137.0, 607.0)},
            },
            'diki_portrait': {
                'drafter':          {'img': fitz.Rect( 25.0, 1057.0, 120.0, 1148.0), 'text': fitz.Rect( 22.0, 1152.0, 122.0, 1165.0)},
                'foreman':          {'img': fitz.Rect(124.0, 1057.0, 219.0, 1148.0), 'text': fitz.Rect(122.0, 1152.0, 220.0, 1165.0)},
                'requester':        {'img': fitz.Rect(224.0, 1057.0, 319.0, 1148.0), 'text': fitz.Rect(222.0, 1152.0, 320.0, 1165.0)},
                'staff_user':       {'img': fitz.Rect(224.0, 1057.0, 319.0, 1148.0), 'text': fitz.Rect(222.0, 1152.0, 320.0, 1165.0)},
                'staff_epr':        {'img': fitz.Rect(224.0, 1057.0, 319.0, 1148.0), 'text': fitz.Rect(222.0, 1152.0, 320.0, 1165.0)},
                'dept':             {'img': fitz.Rect(323.0, 1057.0, 418.0, 1148.0), 'text': fitz.Rect(321.0, 1152.0, 420.0, 1165.0)},
                'dept_approval':    {'img': fitz.Rect(323.0, 1057.0, 418.0, 1148.0), 'text': fitz.Rect(321.0, 1152.0, 420.0, 1165.0)},
                'spv_user':         {'img': fitz.Rect(323.0, 1057.0, 418.0, 1148.0), 'text': fitz.Rect(321.0, 1152.0, 420.0, 1165.0)},
                'spv_dept':         {'img': fitz.Rect(323.0, 1057.0, 418.0, 1148.0), 'text': fitz.Rect(321.0, 1152.0, 420.0, 1165.0)},
                'supervisor_user':  {'img': fitz.Rect(323.0, 1057.0, 418.0, 1148.0), 'text': fitz.Rect(321.0, 1152.0, 420.0, 1165.0)},
                'supervisor':       {'img': fitz.Rect(423.0, 1057.0, 518.0, 1148.0), 'text': fitz.Rect(421.0, 1152.0, 520.0, 1165.0)},
                'spv_eng':          {'img': fitz.Rect(423.0, 1057.0, 518.0, 1148.0), 'text': fitz.Rect(421.0, 1152.0, 520.0, 1165.0)},
                'supervisor_eng':   {'img': fitz.Rect(423.0, 1057.0, 518.0, 1148.0), 'text': fitz.Rect(421.0, 1152.0, 520.0, 1165.0)},
                'manager':          {'img': fitz.Rect(522.0, 1057.0, 618.0, 1148.0), 'text': fitz.Rect(520.0, 1152.0, 619.0, 1165.0)},
                'manager_eng':      {'img': fitz.Rect(522.0, 1057.0, 618.0, 1148.0), 'text': fitz.Rect(520.0, 1152.0, 619.0, 1165.0)},
                'engineer':         {'img': fitz.Rect(522.0, 1057.0, 618.0, 1148.0), 'text': fitz.Rect(520.0, 1152.0, 619.0, 1165.0)},
                'factory_manager':  {'img': fitz.Rect(622.0, 1057.0, 817.0, 1148.0), 'text': fitz.Rect(620.0, 1152.0, 819.0, 1165.0)},
            },
            'rifan_landscape': {
                'drafter':          {'img': fitz.Rect(755.0, 517.0, 786.0, 548.0), 'text': fitz.Rect(753.5, 549.0, 786.5, 560.0)},
                'foreman':          {'img': fitz.Rect(789.0, 517.0, 820.0, 548.0), 'text': fitz.Rect(787.5, 549.0, 820.5, 560.0)},
                'requester':        {'img': fitz.Rect(685.0, 517.0, 717.0, 548.0), 'text': fitz.Rect(684.5, 549.0, 717.5, 560.0)},
                'staff_user':       {'img': fitz.Rect(685.0, 517.0, 717.0, 548.0), 'text': fitz.Rect(684.5, 549.0, 717.5, 560.0)},
                'staff_epr':        {'img': fitz.Rect(685.0, 517.0, 717.0, 548.0), 'text': fitz.Rect(684.5, 549.0, 717.5, 560.0)},
                'dept':             {'img': fitz.Rect(719.0, 517.0, 751.0, 548.0), 'text': fitz.Rect(718.5, 549.0, 751.5, 560.0)},
                'dept_approval':    {'img': fitz.Rect(719.0, 517.0, 751.0, 548.0), 'text': fitz.Rect(718.5, 549.0, 751.5, 560.0)},
                'spv_user':         {'img': fitz.Rect(719.0, 517.0, 751.0, 548.0), 'text': fitz.Rect(718.5, 549.0, 751.5, 560.0)},
                'spv_dept':         {'img': fitz.Rect(719.0, 517.0, 751.0, 548.0), 'text': fitz.Rect(718.5, 549.0, 751.5, 560.0)},
                'supervisor_user':  {'img': fitz.Rect(719.0, 517.0, 751.0, 548.0), 'text': fitz.Rect(718.5, 549.0, 751.5, 560.0)},
                'supervisor':       {'img': fitz.Rect(624.0, 517.0, 676.0, 548.0), 'text': fitz.Rect(616.0, 549.0, 683.0, 560.0)},
                'spv_eng':          {'img': fitz.Rect(624.0, 517.0, 676.0, 548.0), 'text': fitz.Rect(616.0, 549.0, 683.0, 560.0)},
                'supervisor_eng':   {'img': fitz.Rect(624.0, 517.0, 676.0, 548.0), 'text': fitz.Rect(616.0, 549.0, 683.0, 560.0)},
                'manager':          {'img': fitz.Rect(555.0, 517.0, 607.0, 548.0), 'text': fitz.Rect(547.0, 549.0, 614.0, 560.0)},
                'manager_eng':      {'img': fitz.Rect(555.0, 517.0, 607.0, 548.0), 'text': fitz.Rect(547.0, 549.0, 614.0, 560.0)},
                'engineer':         {'img': fitz.Rect(555.0, 517.0, 607.0, 548.0), 'text': fitz.Rect(547.0, 549.0, 614.0, 560.0)},
                'factory_manager':  {'img': fitz.Rect(555.0, 517.0, 607.0, 548.0), 'text': fitz.Rect(547.0, 549.0, 614.0, 560.0)}
            },
            'rifan_portrait': {
                'drafter':          {'img': fitz.Rect(518.0, 673.5, 544.3, 706.5), 'text': fitz.Rect(517.0, 707.0, 545.3, 717.5)},
                'foreman':          {'img': fitz.Rect(547.1, 673.5, 573.4, 706.5), 'text': fitz.Rect(546.1, 707.0, 574.4, 717.5)},
                'requester':        {'img': fitz.Rect(459.8, 673.5, 486.1, 706.5), 'text': fitz.Rect(458.8, 707.0, 487.1, 717.5)},
                'staff_user':       {'img': fitz.Rect(459.8, 673.5, 486.1, 706.5), 'text': fitz.Rect(458.8, 707.0, 487.1, 717.5)},
                'staff_epr':        {'img': fitz.Rect(459.8, 673.5, 486.1, 706.5), 'text': fitz.Rect(458.8, 707.0, 487.1, 717.5)},
                'dept':             {'img': fitz.Rect(488.9, 673.5, 515.2, 706.5), 'text': fitz.Rect(487.9, 707.0, 516.2, 717.5)},
                'dept_approval':    {'img': fitz.Rect(488.9, 673.5, 515.2, 706.5), 'text': fitz.Rect(487.9, 707.0, 516.2, 717.5)},
                'spv_user':         {'img': fitz.Rect(488.9, 673.5, 515.2, 706.5), 'text': fitz.Rect(487.9, 707.0, 516.2, 717.5)},
                'spv_dept':         {'img': fitz.Rect(488.9, 673.5, 515.2, 706.5), 'text': fitz.Rect(487.9, 707.0, 516.2, 717.5)},
                'supervisor_user':  {'img': fitz.Rect(488.9, 673.5, 515.2, 706.5), 'text': fitz.Rect(487.9, 707.0, 516.2, 717.5)},
                'supervisor':       {'img': fitz.Rect(402.0, 673.5, 456.5, 706.5), 'text': fitz.Rect(401.0, 707.0, 457.5, 717.5)},
                'spv_eng':          {'img': fitz.Rect(402.0, 673.5, 456.5, 706.5), 'text': fitz.Rect(401.0, 707.0, 457.5, 717.5)},
                'supervisor_eng':   {'img': fitz.Rect(402.0, 673.5, 456.5, 706.5), 'text': fitz.Rect(401.0, 707.0, 457.5, 717.5)},
                'manager':          {'img': fitz.Rect(330.5, 673.5, 398.0, 706.5), 'text': fitz.Rect(329.5, 707.0, 399.0, 717.5)},
                'manager_eng':      {'img': fitz.Rect(330.5, 673.5, 398.0, 706.5), 'text': fitz.Rect(329.5, 707.0, 399.0, 717.5)},
                'engineer':         {'img': fitz.Rect(330.5, 673.5, 398.0, 706.5), 'text': fitz.Rect(329.5, 707.0, 399.0, 717.5)},
                'factory_manager':  {'img': fitz.Rect(330.5, 673.5, 398.0, 706.5), 'text': fitz.Rect(329.5, 707.0, 399.0, 717.5)}
            }
        }

        if 'sipil' in cat_lower:
            map_key = 'diki_portrait' if 'portrait' in orient_lower or 'potrait' in orient_lower else 'diki_landscape'
        else:
            map_key = 'rifan_portrait' if 'portrait' in orient_lower or 'potrait' in orient_lower else 'rifan_landscape'

        selected_map = coord_maps.get(map_key, coord_maps['diki_landscape'])
        target = selected_map.get(role)

        if target:
            img_rect = target.get('img') if isinstance(target, dict) else target
            text_rect = target.get('text') if isinstance(target, dict) else None

            if img_rect and img_bytes:
                raw_img, rot_img, _ = map_visual_rect_to_page(page, img_rect)
                page.insert_image(raw_img, stream=img_bytes, rotate=rot_img)

            if text_rect and signer_name:
                clean_name = str(signer_name).strip()
                raw_txt, _, rot_txt = map_visual_rect_to_page(page, text_rect)
                avail_len = raw_txt.height if (page.rotation in [90, 270]) else raw_txt.width
                display_name, calc_fontsize = format_and_fit_signer_name(clean_name, avail_len, max_fontsize=5.7, min_fontsize=4.8)
                curr_fs = calc_fontsize
                rc = page.insert_textbox(raw_txt, display_name, fontsize=curr_fs, fontname='helv', color=(0, 0, 0), align=1, rotate=rot_txt)
                while rc < 0 and curr_fs > 3.8:
                    curr_fs -= 0.2
                    rc = page.insert_textbox(raw_txt, display_name, fontsize=curr_fs, fontname='helv', color=(0, 0, 0), align=1, rotate=rot_txt)
            
        temp_path = file_path + ".tmp"
        doc.save(temp_path)
        doc.close()
        
        if os.path.exists(temp_path):
            os.replace(temp_path, file_path)
            print(f"Successfully stamped signature for role '{role}' ({signer_name}) on {file_path}")
    except Exception as e:
        print(f"Error applying PDF signature: {e}")

def apply_drawing_pdf_signatures(file_path, approvals_dict, etiket_category='Sipil', etiket_orientation='landscape'):
    if not os.path.exists(file_path) or not file_path.lower().endswith('.pdf'):
        return

    try:
        orig_path = file_path + ".orig.pdf"
        if not os.path.exists(orig_path):
            shutil.copyfile(file_path, orig_path)
        else:
            shutil.copyfile(orig_path, file_path)

        cat_lower = str(etiket_category or '').lower()
        orient_lower = str(etiket_orientation or '').lower()
        is_rifan_landscape = ('sipil' not in cat_lower) and ('portrait' not in orient_lower and 'potrait' not in orient_lower)
        is_rifan_portrait = ('sipil' not in cat_lower) and ('portrait' in orient_lower or 'potrait' in orient_lower)

        if is_rifan_landscape:
            try:
                doc = fitz.open(file_path)
                p = doc[0]
                r0 = fitz.Rect(21.0, 546.5, 33.5, 614.5)
                r_col2 = fitz.Rect(21.0, 615.5, 33.5, 683.5)
                r1 = fitz.Rect(21.5, 684.5, 33.0, 711.2)
                r2 = fitz.Rect(21.5, 712.5, 33.0, 752.0)
                r3 = fitz.Rect(21.5, 753.5, 33.0, 780.5)
                r4 = fitz.Rect(21.5, 782.0, 33.0, 820.5)
                p.add_redact_annot(r0, fill=(1, 1, 1))
                p.add_redact_annot(r_col2, fill=(1, 1, 1))
                p.add_redact_annot(r1, fill=(1, 1, 1))
                p.add_redact_annot(r2, fill=(1, 1, 1))
                p.add_redact_annot(r3, fill=(1, 1, 1))
                p.add_redact_annot(r4, fill=(1, 1, 1))
                p.apply_redactions()

                p.insert_textbox(fitz.Rect(20.5, 546.5, 33.5, 614.5), 'Approved', fontsize=6.2, fontname='helv', color=(0, 0, 0), align=1, rotate=270)
                p.insert_textbox(fitz.Rect(20.5, 615.5, 33.5, 683.5), 'Checked', fontsize=6.2, fontname='helv', color=(0, 0, 0), align=1, rotate=270)
                p.insert_textbox(fitz.Rect(20.5, 684.0, 33.5, 711.9), 'Request', fontsize=6.2, fontname='helv', color=(0, 0, 0), align=1, rotate=270)
                p.insert_textbox(fitz.Rect(20.5, 712.0, 33.5, 752.7), 'Checked', fontsize=6.2, fontname='helv', color=(0, 0, 0), align=1, rotate=270)
                p.insert_textbox(fitz.Rect(20.5, 752.7, 33.5, 781.3), 'Drawn', fontsize=6.2, fontname='helv', color=(0, 0, 0), align=1, rotate=270)
                p.insert_textbox(fitz.Rect(20.5, 781.3, 33.5, 821.6), 'Checked', fontsize=6.2, fontname='helv', color=(0, 0, 0), align=1, rotate=270)

                lines = [
                    (fitz.Point(20.28, 546.08), fitz.Point(20.28, 821.60)),
                    (fitz.Point(33.96, 546.08), fitz.Point(33.96, 821.60)),
                    (fitz.Point(79.92, 546.08), fitz.Point(79.92, 821.60)),
                    (fitz.Point(20.28, 546.08), fitz.Point(79.92, 546.08)),
                    (fitz.Point(20.28, 614.96), fitz.Point(79.92, 614.96)),
                    (fitz.Point(20.28, 683.84), fitz.Point(79.92, 683.84)),
                    (fitz.Point(20.28, 752.72), fitz.Point(79.92, 752.72)),
                    (fitz.Point(20.28, 821.60), fitz.Point(79.92, 821.60)),
                    (fitz.Point(20.28, 711.92), fitz.Point(33.96, 711.92)),
                    (fitz.Point(20.28, 781.28), fitz.Point(33.96, 781.28)),
                ]
                for p0, p1 in lines:
                    p.draw_line(p0, p1, color=(0, 0, 0), width=0.72)

                temp_path = file_path + ".tmp"
                doc.save(temp_path)
                doc.close()
                if os.path.exists(temp_path):
                    os.replace(temp_path, file_path)
            except Exception as label_err:
                print(f"Error ensuring swapped labels on rifan_landscape: {label_err}")

        if not isinstance(approvals_dict, dict):
            return

        for role_key, app in approvals_dict.items():
            if isinstance(app, dict) and app.get('signature') and not role_key.endswith('_reject'):
                try:
                    apply_pdf_signature(file_path, role_key, app['signature'], app.get('signer', ''), etiket_category, etiket_orientation)
                except Exception as sig_err:
                    print(f"Error applying drawing PDF signature for '{role_key}': {sig_err}")
    except Exception as e:
        print(f"Error in apply_drawing_pdf_signatures: {e}")

def apply_project_handover_pdf_signatures(file_path, handover_approvals_dict):
    if not os.path.exists(file_path) or not file_path.lower().endswith('.pdf'):
        return

    try:
        orig_path = file_path + ".orig.pdf"
        if not os.path.exists(orig_path):
            shutil.copyfile(file_path, orig_path)
        else:
            shutil.copyfile(orig_path, file_path)

        doc = fitz.open(file_path)
        page = doc[0]
        for p in doc:
            if p.search_for('Dibuat oleh'):
                page = p
                break

        page.draw_rect(fitz.Rect(50, 345.0, 545, 455.0), color=(1, 1, 1), fill=(1, 1, 1))

        role_cols = {
            'staff_eng': ((55, 132), 'Dibuat oleh,', 'Staff ENG'),
            'spv_eng': ((135, 212), 'Diketahui oleh,', 'SPV ENG'),
            'manager_eng': ((215, 292), 'Disetujui oleh,', 'Manager ENG'),
            'manager_user': ((295, 372), 'Disetujui oleh,', 'Manager User'),
            'spv_user': ((375, 452), 'Diketahui oleh,', 'SPV User'),
            'staff_user': ((455, 532), 'Diterima oleh,', 'Staff User')
        }

        stamped = False
        for role_key, ((x0, x1), header_title, role_title) in role_cols.items():
            cx = (x0 + x1) / 2.0
            hw = fitz.get_text_length(header_title, fontname="helv", fontsize=8.0)
            page.insert_text(fitz.Point(cx - hw / 2.0, 358.0), header_title, fontsize=8.0, fontname="helv", color=(0, 0, 0))

            rw = fitz.get_text_length(role_title, fontname="helv", fontsize=8.0)
            page.insert_text(fitz.Point(cx - rw / 2.0, 438.0), role_title, fontsize=8.0, fontname="helv", color=(0, 0, 0))

            app_info = handover_approvals_dict.get(role_key)
            if not app_info or not isinstance(app_info, dict):
                continue

            sig_data = app_info.get('signature')
            signer_name = app_info.get('signer') or app_info.get('username') or ''

            sig_rect = fitz.Rect(x0, 362.0, x1, 414.0)
            if sig_data:
                try:
                    base64_str = sig_data.split(",", 1)[1] if ',' in sig_data else sig_data
                    img_bytes = base64.b64decode(base64_str)
                    page.insert_image(sig_rect, stream=img_bytes, keep_proportion=True)
                    stamped = True
                except Exception as ie:
                    print(f"Error inserting signature for {role_key}: {ie}")

            if signer_name:
                try:
                    name_str = str(signer_name)
                    col_w = (x1 - x0) * 0.95
                    disp_name, fs = format_and_fit_signer_name(name_str, col_w, max_fontsize=7.5, min_fontsize=5.0)
                    nw = fitz.get_text_length(disp_name, fontname="helv", fontsize=fs)
                    page.insert_text(fitz.Point(cx - nw / 2.0, 424.0), disp_name, fontsize=fs, fontname="helv", color=(0, 0, 0))
                    stamped = True
                except Exception as ne:
                    print(f"Error writing signer name for {role_key}: {ne}")

        if stamped:
            temp_path = file_path + ".tmp"
            doc.save(temp_path)
            doc.close()
            if os.path.exists(temp_path):
                os.replace(temp_path, file_path)
        else:
            doc.close()
    except Exception as e:
        print(f"Error in apply_project_handover_pdf_signatures: {e}")

if __name__ == '__main__':
    mode = sys.argv[1] if len(sys.argv) > 1 else ''
    if mode == 'drawing':
        file_path = sys.argv[2]
        approvals_file = sys.argv[3]
        cat = sys.argv[4] if len(sys.argv) > 4 else 'Sipil'
        orient = sys.argv[5] if len(sys.argv) > 5 else 'landscape'
        with open(approvals_file, 'r', encoding='utf-8') as f:
            apps = json.load(f)
        apply_drawing_pdf_signatures(file_path, apps, cat, orient)
    elif mode == 'handover':
        file_path = sys.argv[2]
        json_file = sys.argv[3]
        with open(json_file, 'r', encoding='utf-8') as f:
            apps = json.load(f)
        apply_project_handover_pdf_signatures(file_path, apps)
