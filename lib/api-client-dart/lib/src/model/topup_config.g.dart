// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'topup_config.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TopupConfig extends TopupConfig {
  @override
  final int rupiahPerCredit;
  @override
  final String qrisImageUrl;

  factory _$TopupConfig([void Function(TopupConfigBuilder)? updates]) =>
      (TopupConfigBuilder()..update(updates))._build();

  _$TopupConfig._({required this.rupiahPerCredit, required this.qrisImageUrl})
      : super._();
  @override
  TopupConfig rebuild(void Function(TopupConfigBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TopupConfigBuilder toBuilder() => TopupConfigBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TopupConfig &&
        rupiahPerCredit == other.rupiahPerCredit &&
        qrisImageUrl == other.qrisImageUrl;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, rupiahPerCredit.hashCode);
    _$hash = $jc(_$hash, qrisImageUrl.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'TopupConfig')
          ..add('rupiahPerCredit', rupiahPerCredit)
          ..add('qrisImageUrl', qrisImageUrl))
        .toString();
  }
}

class TopupConfigBuilder implements Builder<TopupConfig, TopupConfigBuilder> {
  _$TopupConfig? _$v;

  int? _rupiahPerCredit;
  int? get rupiahPerCredit => _$this._rupiahPerCredit;
  set rupiahPerCredit(int? rupiahPerCredit) =>
      _$this._rupiahPerCredit = rupiahPerCredit;

  String? _qrisImageUrl;
  String? get qrisImageUrl => _$this._qrisImageUrl;
  set qrisImageUrl(String? qrisImageUrl) => _$this._qrisImageUrl = qrisImageUrl;

  TopupConfigBuilder() {
    TopupConfig._defaults(this);
  }

  TopupConfigBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _rupiahPerCredit = $v.rupiahPerCredit;
      _qrisImageUrl = $v.qrisImageUrl;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(TopupConfig other) {
    _$v = other as _$TopupConfig;
  }

  @override
  void update(void Function(TopupConfigBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TopupConfig build() => _build();

  _$TopupConfig _build() {
    final _$result = _$v ??
        _$TopupConfig._(
          rupiahPerCredit: BuiltValueNullFieldError.checkNotNull(
              rupiahPerCredit, r'TopupConfig', 'rupiahPerCredit'),
          qrisImageUrl: BuiltValueNullFieldError.checkNotNull(
              qrisImageUrl, r'TopupConfig', 'qrisImageUrl'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
