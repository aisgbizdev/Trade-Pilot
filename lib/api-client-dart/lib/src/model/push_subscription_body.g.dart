// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'push_subscription_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$PushSubscriptionBody extends PushSubscriptionBody {
  @override
  final String endpoint;
  @override
  final PushSubscriptionKeys keys;

  factory _$PushSubscriptionBody(
          [void Function(PushSubscriptionBodyBuilder)? updates]) =>
      (PushSubscriptionBodyBuilder()..update(updates))._build();

  _$PushSubscriptionBody._({required this.endpoint, required this.keys})
      : super._();
  @override
  PushSubscriptionBody rebuild(
          void Function(PushSubscriptionBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  PushSubscriptionBodyBuilder toBuilder() =>
      PushSubscriptionBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is PushSubscriptionBody &&
        endpoint == other.endpoint &&
        keys == other.keys;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, endpoint.hashCode);
    _$hash = $jc(_$hash, keys.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'PushSubscriptionBody')
          ..add('endpoint', endpoint)
          ..add('keys', keys))
        .toString();
  }
}

class PushSubscriptionBodyBuilder
    implements Builder<PushSubscriptionBody, PushSubscriptionBodyBuilder> {
  _$PushSubscriptionBody? _$v;

  String? _endpoint;
  String? get endpoint => _$this._endpoint;
  set endpoint(String? endpoint) => _$this._endpoint = endpoint;

  PushSubscriptionKeysBuilder? _keys;
  PushSubscriptionKeysBuilder get keys =>
      _$this._keys ??= PushSubscriptionKeysBuilder();
  set keys(PushSubscriptionKeysBuilder? keys) => _$this._keys = keys;

  PushSubscriptionBodyBuilder() {
    PushSubscriptionBody._defaults(this);
  }

  PushSubscriptionBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _endpoint = $v.endpoint;
      _keys = $v.keys.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(PushSubscriptionBody other) {
    _$v = other as _$PushSubscriptionBody;
  }

  @override
  void update(void Function(PushSubscriptionBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  PushSubscriptionBody build() => _build();

  _$PushSubscriptionBody _build() {
    _$PushSubscriptionBody _$result;
    try {
      _$result = _$v ??
          _$PushSubscriptionBody._(
            endpoint: BuiltValueNullFieldError.checkNotNull(
                endpoint, r'PushSubscriptionBody', 'endpoint'),
            keys: keys.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'keys';
        keys.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'PushSubscriptionBody', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
