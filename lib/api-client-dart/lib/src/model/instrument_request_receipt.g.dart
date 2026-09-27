// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'instrument_request_receipt.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$InstrumentRequestReceipt extends InstrumentRequestReceipt {
  @override
  final String code;
  @override
  final bool recorded;

  factory _$InstrumentRequestReceipt(
          [void Function(InstrumentRequestReceiptBuilder)? updates]) =>
      (InstrumentRequestReceiptBuilder()..update(updates))._build();

  _$InstrumentRequestReceipt._({required this.code, required this.recorded})
      : super._();
  @override
  InstrumentRequestReceipt rebuild(
          void Function(InstrumentRequestReceiptBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  InstrumentRequestReceiptBuilder toBuilder() =>
      InstrumentRequestReceiptBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is InstrumentRequestReceipt &&
        code == other.code &&
        recorded == other.recorded;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, code.hashCode);
    _$hash = $jc(_$hash, recorded.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'InstrumentRequestReceipt')
          ..add('code', code)
          ..add('recorded', recorded))
        .toString();
  }
}

class InstrumentRequestReceiptBuilder
    implements
        Builder<InstrumentRequestReceipt, InstrumentRequestReceiptBuilder> {
  _$InstrumentRequestReceipt? _$v;

  String? _code;
  String? get code => _$this._code;
  set code(String? code) => _$this._code = code;

  bool? _recorded;
  bool? get recorded => _$this._recorded;
  set recorded(bool? recorded) => _$this._recorded = recorded;

  InstrumentRequestReceiptBuilder() {
    InstrumentRequestReceipt._defaults(this);
  }

  InstrumentRequestReceiptBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _code = $v.code;
      _recorded = $v.recorded;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(InstrumentRequestReceipt other) {
    _$v = other as _$InstrumentRequestReceipt;
  }

  @override
  void update(void Function(InstrumentRequestReceiptBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  InstrumentRequestReceipt build() => _build();

  _$InstrumentRequestReceipt _build() {
    final _$result = _$v ??
        _$InstrumentRequestReceipt._(
          code: BuiltValueNullFieldError.checkNotNull(
              code, r'InstrumentRequestReceipt', 'code'),
          recorded: BuiltValueNullFieldError.checkNotNull(
              recorded, r'InstrumentRequestReceipt', 'recorded'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
