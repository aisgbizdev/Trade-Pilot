// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'mobile_auth_exchange_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$MobileAuthExchangeBody extends MobileAuthExchangeBody {
  @override
  final String code;
  @override
  final String codeVerifier;

  factory _$MobileAuthExchangeBody(
          [void Function(MobileAuthExchangeBodyBuilder)? updates]) =>
      (MobileAuthExchangeBodyBuilder()..update(updates))._build();

  _$MobileAuthExchangeBody._({required this.code, required this.codeVerifier})
      : super._();
  @override
  MobileAuthExchangeBody rebuild(
          void Function(MobileAuthExchangeBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  MobileAuthExchangeBodyBuilder toBuilder() =>
      MobileAuthExchangeBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is MobileAuthExchangeBody &&
        code == other.code &&
        codeVerifier == other.codeVerifier;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, code.hashCode);
    _$hash = $jc(_$hash, codeVerifier.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'MobileAuthExchangeBody')
          ..add('code', code)
          ..add('codeVerifier', codeVerifier))
        .toString();
  }
}

class MobileAuthExchangeBodyBuilder
    implements Builder<MobileAuthExchangeBody, MobileAuthExchangeBodyBuilder> {
  _$MobileAuthExchangeBody? _$v;

  String? _code;
  String? get code => _$this._code;
  set code(String? code) => _$this._code = code;

  String? _codeVerifier;
  String? get codeVerifier => _$this._codeVerifier;
  set codeVerifier(String? codeVerifier) => _$this._codeVerifier = codeVerifier;

  MobileAuthExchangeBodyBuilder() {
    MobileAuthExchangeBody._defaults(this);
  }

  MobileAuthExchangeBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _code = $v.code;
      _codeVerifier = $v.codeVerifier;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(MobileAuthExchangeBody other) {
    _$v = other as _$MobileAuthExchangeBody;
  }

  @override
  void update(void Function(MobileAuthExchangeBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  MobileAuthExchangeBody build() => _build();

  _$MobileAuthExchangeBody _build() {
    final _$result = _$v ??
        _$MobileAuthExchangeBody._(
          code: BuiltValueNullFieldError.checkNotNull(
              code, r'MobileAuthExchangeBody', 'code'),
          codeVerifier: BuiltValueNullFieldError.checkNotNull(
              codeVerifier, r'MobileAuthExchangeBody', 'codeVerifier'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
