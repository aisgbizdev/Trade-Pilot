// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'topup_config.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TopupConfig extends TopupConfig {
  @override
  final BuiltList<TopupPackageOption> packages;
  @override
  final String qrisImageUrl;

  factory _$TopupConfig([void Function(TopupConfigBuilder)? updates]) =>
      (TopupConfigBuilder()..update(updates))._build();

  _$TopupConfig._({required this.packages, required this.qrisImageUrl})
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
        packages == other.packages &&
        qrisImageUrl == other.qrisImageUrl;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, packages.hashCode);
    _$hash = $jc(_$hash, qrisImageUrl.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'TopupConfig')
          ..add('packages', packages)
          ..add('qrisImageUrl', qrisImageUrl))
        .toString();
  }
}

class TopupConfigBuilder implements Builder<TopupConfig, TopupConfigBuilder> {
  _$TopupConfig? _$v;

  ListBuilder<TopupPackageOption>? _packages;
  ListBuilder<TopupPackageOption> get packages =>
      _$this._packages ??= ListBuilder<TopupPackageOption>();
  set packages(ListBuilder<TopupPackageOption>? packages) =>
      _$this._packages = packages;

  String? _qrisImageUrl;
  String? get qrisImageUrl => _$this._qrisImageUrl;
  set qrisImageUrl(String? qrisImageUrl) => _$this._qrisImageUrl = qrisImageUrl;

  TopupConfigBuilder() {
    TopupConfig._defaults(this);
  }

  TopupConfigBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _packages = $v.packages.toBuilder();
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
    _$TopupConfig _$result;
    try {
      _$result = _$v ??
          _$TopupConfig._(
            packages: packages.build(),
            qrisImageUrl: BuiltValueNullFieldError.checkNotNull(
                qrisImageUrl, r'TopupConfig', 'qrisImageUrl'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'packages';
        packages.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'TopupConfig', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
