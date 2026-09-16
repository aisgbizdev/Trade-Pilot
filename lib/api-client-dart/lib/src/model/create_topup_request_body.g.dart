// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_topup_request_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$CreateTopupRequestBody extends CreateTopupRequestBody {
  @override
  final int amountRupiah;
  @override
  final String? paymentReferenceNote;
  @override
  final String proofObjectPath;

  factory _$CreateTopupRequestBody(
          [void Function(CreateTopupRequestBodyBuilder)? updates]) =>
      (CreateTopupRequestBodyBuilder()..update(updates))._build();

  _$CreateTopupRequestBody._(
      {required this.amountRupiah,
      this.paymentReferenceNote,
      required this.proofObjectPath})
      : super._();
  @override
  CreateTopupRequestBody rebuild(
          void Function(CreateTopupRequestBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  CreateTopupRequestBodyBuilder toBuilder() =>
      CreateTopupRequestBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CreateTopupRequestBody &&
        amountRupiah == other.amountRupiah &&
        paymentReferenceNote == other.paymentReferenceNote &&
        proofObjectPath == other.proofObjectPath;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, amountRupiah.hashCode);
    _$hash = $jc(_$hash, paymentReferenceNote.hashCode);
    _$hash = $jc(_$hash, proofObjectPath.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'CreateTopupRequestBody')
          ..add('amountRupiah', amountRupiah)
          ..add('paymentReferenceNote', paymentReferenceNote)
          ..add('proofObjectPath', proofObjectPath))
        .toString();
  }
}

class CreateTopupRequestBodyBuilder
    implements Builder<CreateTopupRequestBody, CreateTopupRequestBodyBuilder> {
  _$CreateTopupRequestBody? _$v;

  int? _amountRupiah;
  int? get amountRupiah => _$this._amountRupiah;
  set amountRupiah(int? amountRupiah) => _$this._amountRupiah = amountRupiah;

  String? _paymentReferenceNote;
  String? get paymentReferenceNote => _$this._paymentReferenceNote;
  set paymentReferenceNote(String? paymentReferenceNote) =>
      _$this._paymentReferenceNote = paymentReferenceNote;

  String? _proofObjectPath;
  String? get proofObjectPath => _$this._proofObjectPath;
  set proofObjectPath(String? proofObjectPath) =>
      _$this._proofObjectPath = proofObjectPath;

  CreateTopupRequestBodyBuilder() {
    CreateTopupRequestBody._defaults(this);
  }

  CreateTopupRequestBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _amountRupiah = $v.amountRupiah;
      _paymentReferenceNote = $v.paymentReferenceNote;
      _proofObjectPath = $v.proofObjectPath;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(CreateTopupRequestBody other) {
    _$v = other as _$CreateTopupRequestBody;
  }

  @override
  void update(void Function(CreateTopupRequestBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  CreateTopupRequestBody build() => _build();

  _$CreateTopupRequestBody _build() {
    final _$result = _$v ??
        _$CreateTopupRequestBody._(
          amountRupiah: BuiltValueNullFieldError.checkNotNull(
              amountRupiah, r'CreateTopupRequestBody', 'amountRupiah'),
          paymentReferenceNote: paymentReferenceNote,
          proofObjectPath: BuiltValueNullFieldError.checkNotNull(
              proofObjectPath, r'CreateTopupRequestBody', 'proofObjectPath'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
