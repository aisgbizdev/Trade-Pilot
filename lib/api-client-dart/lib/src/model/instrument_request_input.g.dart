// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'instrument_request_input.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$InstrumentRequestInput extends InstrumentRequestInput {
  @override
  final String code;

  factory _$InstrumentRequestInput(
          [void Function(InstrumentRequestInputBuilder)? updates]) =>
      (InstrumentRequestInputBuilder()..update(updates))._build();

  _$InstrumentRequestInput._({required this.code}) : super._();
  @override
  InstrumentRequestInput rebuild(
          void Function(InstrumentRequestInputBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  InstrumentRequestInputBuilder toBuilder() =>
      InstrumentRequestInputBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is InstrumentRequestInput && code == other.code;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, code.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'InstrumentRequestInput')
          ..add('code', code))
        .toString();
  }
}

class InstrumentRequestInputBuilder
    implements Builder<InstrumentRequestInput, InstrumentRequestInputBuilder> {
  _$InstrumentRequestInput? _$v;

  String? _code;
  String? get code => _$this._code;
  set code(String? code) => _$this._code = code;

  InstrumentRequestInputBuilder() {
    InstrumentRequestInput._defaults(this);
  }

  InstrumentRequestInputBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _code = $v.code;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(InstrumentRequestInput other) {
    _$v = other as _$InstrumentRequestInput;
  }

  @override
  void update(void Function(InstrumentRequestInputBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  InstrumentRequestInput build() => _build();

  _$InstrumentRequestInput _build() {
    final _$result = _$v ??
        _$InstrumentRequestInput._(
          code: BuiltValueNullFieldError.checkNotNull(
              code, r'InstrumentRequestInput', 'code'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
