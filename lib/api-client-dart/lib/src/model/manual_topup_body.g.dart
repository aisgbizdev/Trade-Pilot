// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'manual_topup_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ManualTopupBody extends ManualTopupBody {
  @override
  final int userId;
  @override
  final int amountRupiah;
  @override
  final int credits;
  @override
  final String note;

  factory _$ManualTopupBody([void Function(ManualTopupBodyBuilder)? updates]) =>
      (ManualTopupBodyBuilder()..update(updates))._build();

  _$ManualTopupBody._(
      {required this.userId,
      required this.amountRupiah,
      required this.credits,
      required this.note})
      : super._();
  @override
  ManualTopupBody rebuild(void Function(ManualTopupBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ManualTopupBodyBuilder toBuilder() => ManualTopupBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ManualTopupBody &&
        userId == other.userId &&
        amountRupiah == other.amountRupiah &&
        credits == other.credits &&
        note == other.note;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, userId.hashCode);
    _$hash = $jc(_$hash, amountRupiah.hashCode);
    _$hash = $jc(_$hash, credits.hashCode);
    _$hash = $jc(_$hash, note.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'ManualTopupBody')
          ..add('userId', userId)
          ..add('amountRupiah', amountRupiah)
          ..add('credits', credits)
          ..add('note', note))
        .toString();
  }
}

class ManualTopupBodyBuilder
    implements Builder<ManualTopupBody, ManualTopupBodyBuilder> {
  _$ManualTopupBody? _$v;

  int? _userId;
  int? get userId => _$this._userId;
  set userId(int? userId) => _$this._userId = userId;

  int? _amountRupiah;
  int? get amountRupiah => _$this._amountRupiah;
  set amountRupiah(int? amountRupiah) => _$this._amountRupiah = amountRupiah;

  int? _credits;
  int? get credits => _$this._credits;
  set credits(int? credits) => _$this._credits = credits;

  String? _note;
  String? get note => _$this._note;
  set note(String? note) => _$this._note = note;

  ManualTopupBodyBuilder() {
    ManualTopupBody._defaults(this);
  }

  ManualTopupBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _userId = $v.userId;
      _amountRupiah = $v.amountRupiah;
      _credits = $v.credits;
      _note = $v.note;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ManualTopupBody other) {
    _$v = other as _$ManualTopupBody;
  }

  @override
  void update(void Function(ManualTopupBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ManualTopupBody build() => _build();

  _$ManualTopupBody _build() {
    final _$result = _$v ??
        _$ManualTopupBody._(
          userId: BuiltValueNullFieldError.checkNotNull(
              userId, r'ManualTopupBody', 'userId'),
          amountRupiah: BuiltValueNullFieldError.checkNotNull(
              amountRupiah, r'ManualTopupBody', 'amountRupiah'),
          credits: BuiltValueNullFieldError.checkNotNull(
              credits, r'ManualTopupBody', 'credits'),
          note: BuiltValueNullFieldError.checkNotNull(
              note, r'ManualTopupBody', 'note'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
