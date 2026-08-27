// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'push_public_key.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$PushPublicKey extends PushPublicKey {
  @override
  final String publicKey;

  factory _$PushPublicKey([void Function(PushPublicKeyBuilder)? updates]) =>
      (PushPublicKeyBuilder()..update(updates))._build();

  _$PushPublicKey._({required this.publicKey}) : super._();
  @override
  PushPublicKey rebuild(void Function(PushPublicKeyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  PushPublicKeyBuilder toBuilder() => PushPublicKeyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is PushPublicKey && publicKey == other.publicKey;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, publicKey.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'PushPublicKey')
          ..add('publicKey', publicKey))
        .toString();
  }
}

class PushPublicKeyBuilder
    implements Builder<PushPublicKey, PushPublicKeyBuilder> {
  _$PushPublicKey? _$v;

  String? _publicKey;
  String? get publicKey => _$this._publicKey;
  set publicKey(String? publicKey) => _$this._publicKey = publicKey;

  PushPublicKeyBuilder() {
    PushPublicKey._defaults(this);
  }

  PushPublicKeyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _publicKey = $v.publicKey;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(PushPublicKey other) {
    _$v = other as _$PushPublicKey;
  }

  @override
  void update(void Function(PushPublicKeyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  PushPublicKey build() => _build();

  _$PushPublicKey _build() {
    final _$result = _$v ??
        _$PushPublicKey._(
          publicKey: BuiltValueNullFieldError.checkNotNull(
              publicKey, r'PushPublicKey', 'publicKey'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
